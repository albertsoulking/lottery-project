import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { BalanceLog, BalanceChangeType } from '../entities/balance-log.entity'
import { Post } from '../entities/post.entity'
import { PurchaseRecord } from '../entities/purchase-record.entity'
import { User } from '../entities/user.entity'

@Injectable()
export class TransactionsService {
  private readonly lastPurchaseAttempt = new Map<number, number>()

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(PurchaseRecord) private readonly purchaseRepository: Repository<PurchaseRecord>,
    @InjectRepository(BalanceLog) private readonly logRepository: Repository<BalanceLog>,
  ) {}

  async purchase(userId: number, postId: number) {
    const now = Date.now()
    const lastAttempt = this.lastPurchaseAttempt.get(userId) ?? 0
    const MIN_INTERVAL_MS = 3000
    if (now - lastAttempt < MIN_INTERVAL_MS) {
      throw new HttpException('请稍后再试，购买频率过高', HttpStatus.TOO_MANY_REQUESTS)
    }
    this.lastPurchaseAttempt.set(userId, now)

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      })
      if (!user || !user.active) {
        throw new NotFoundException('用户不存在或已被禁用')
      }

      const post = await queryRunner.manager.findOne(Post, { where: { id: postId }, relations: ['publisher'] })
      if (!post) {
        throw new NotFoundException('帖子不存在')
      }

      const existingPurchase = await queryRunner.manager.findOne(PurchaseRecord, {
        where: { user: { id: userId }, post: { id: postId } },
        relations: ['post'],
      })
      if (existingPurchase) {
        await queryRunner.commitTransaction()
        return {
          postId: post.id,
          title: post.title,
          summary: post.summary,
          contentHidden: post.contentHidden,
          amount: 0,
          purchasedAt: existingPurchase.purchasedAt,
          purchased: true,
        }
      }

      const price = post.type === 'FREE' ? 0 : post.price
      if (user.balance < price) {
        throw new BadRequestException('余额不足')
      }

      user.balance -= price
      await queryRunner.manager.save(user)

      const purchase = queryRunner.manager.create(PurchaseRecord, {
        user,
        post,
        amount: price,
      })
      await queryRunner.manager.save(purchase)

      const log = queryRunner.manager.create(BalanceLog, {
        user,
        amount: -price,
        type: 'PURCHASE' as BalanceChangeType,
        balanceAfter: user.balance,
        remark: `购买帖子 ${post.id}`,
      })
      await queryRunner.manager.save(log)

      await queryRunner.commitTransaction()
      return {
        postId: post.id,
        title: post.title,
        summary: post.summary,
        contentHidden: post.contentHidden,
        amount: price,
        purchasedAt: purchase.purchasedAt,
        purchased: true,
        isPurchased: true,
      }
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async adjustBalance(userId: number, amount: number, remark?: string) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      })
      if (!user) {
        throw new NotFoundException('用户不存在')
      }

      const newBalance = user.balance + amount
      if (newBalance < 0) {
        throw new BadRequestException('余额调整后不能为负数')
      }

      user.balance = newBalance
      await queryRunner.manager.save(user)

      const log = queryRunner.manager.create(BalanceLog, {
        user,
        amount,
        type: amount >= 0 ? ('RECHARGE' as BalanceChangeType) : ('PURCHASE' as BalanceChangeType),
        balanceAfter: newBalance,
        remark: remark ?? '管理员手动调账',
      })
      await queryRunner.manager.save(log)

      await queryRunner.commitTransaction()
      return { userId: user.id, balance: user.balance }
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async findAllLogs(page = 1, limit = 50) {
    const [items, total] = await this.logRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
      order: { createdAt: 'DESC' },
    })
    return { items, total, page, limit }
  }

  async getFinanceSummary() {
    const rechargeTotalResult = await this.logRepository
      .createQueryBuilder('log')
      .select('SUM(log.amount)', 'sum')
      .where('log.type = :type', { type: 'RECHARGE' })
      .getRawOne<{ sum: string }>()

    const purchaseTotalResult = await this.logRepository
      .createQueryBuilder('log')
      .select('SUM(log.amount)', 'sum')
      .where('log.type = :type', { type: 'PURCHASE' })
      .getRawOne<{ sum: string }>()

    const totalRecharge = Number(rechargeTotalResult?.sum ?? 0)
    const totalConsumption = Math.abs(Number(purchaseTotalResult?.sum ?? 0))

    return { totalRecharge, totalConsumption }
  }
}
