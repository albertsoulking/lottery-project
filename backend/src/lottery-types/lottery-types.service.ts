import { ConflictException, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { PostItem } from '../entities/post-item.entity'
import { LotteryType } from '../entities/lottery-type.entity'
import { DEFAULT_LOTTERY_TYPE_SEED } from './lottery-types.seed'

@Injectable()
export class LotteryTypesService implements OnApplicationBootstrap {
  private readonly logger = new Logger(LotteryTypesService.name)

  constructor(
    @InjectRepository(LotteryType) private readonly lotteryTypeRepository: Repository<LotteryType>,
    private readonly dataSource: DataSource,
  ) {}

  async onApplicationBootstrap() {
    await this.seedIfEmpty()
  }

  findAll() {
    return this.lotteryTypeRepository.find({
      order: {
        id: 'ASC',
      },
    })
  }

  async seedIfEmpty() {
    const total = await this.lotteryTypeRepository.count()
    if (total > 0) {
      return
    }

    await this.dataSource.transaction(async (manager) => {
      const entities = manager.create(LotteryType, DEFAULT_LOTTERY_TYPE_SEED)
      await manager.save(LotteryType, entities)
    })

    this.logger.log(`Inserted ${DEFAULT_LOTTERY_TYPE_SEED.length} predefined lottery types`)
  }

  async resetLotteryTypes() {
    return this.dataSource.transaction(async (manager) => {
      const linkedPostItems = await manager.count(PostItem)
      if (linkedPostItems > 0) {
        throw new ConflictException('Lottery types cannot be reset while post items still reference them.')
      }

      await manager.createQueryBuilder().delete().from(LotteryType).execute()

      const insertedTypes = manager.create(LotteryType, DEFAULT_LOTTERY_TYPE_SEED)
      return manager.save(LotteryType, insertedTypes)
    })
  }
}
