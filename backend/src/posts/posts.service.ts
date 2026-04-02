import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Post } from '../entities/post.entity'
import { User } from '../entities/user.entity'
import { CreatePostDto } from './dto/create-post.dto'
import { PurchaseRecord } from '../entities/purchase-record.entity'
import { LotteryType } from '../entities/lottery-type.entity'
import { PostItem } from '../entities/post-item.entity'
import { LotteryEvaluationConfig, LotteryResultPayload, PredictionData, RuleEngineService } from '../lottery/rule-engine.service'

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(PurchaseRecord) private readonly purchaseRepository: Repository<PurchaseRecord>,
    @InjectRepository(LotteryType) private readonly lotteryTypeRepository: Repository<LotteryType>,
    @InjectRepository(PostItem) private readonly postItemRepository: Repository<PostItem>,
    private readonly ruleEngineService: RuleEngineService,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const publisher = await this.userRepository.findOne({ where: { id: createPostDto.publisherId } })
    if (!publisher) {
      throw new NotFoundException('发布者不存在')
    }
    const entity = this.postRepository.create({
      issue: createPostDto.issue,
      title: createPostDto.title,
      summary: createPostDto.summary,
      contentHidden: createPostDto.contentHidden,
      price: createPostDto.price,
      type: createPostDto.type,
      publisher,
    })
    return this.postRepository.save(entity)
  }

  async cloneLast() {
    const lastPost = await this.postRepository.findOne({
      relations: ['publisher', 'items', 'items.lotteryType'],
      order: { issue: 'DESC', createdAt: 'DESC' },
    })

    if (!lastPost) {
      throw new NotFoundException('暂无可复制的帖子')
    }

    const sortedItems = [...(lastPost.items ?? [])].sort((a, b) => a.id - b.id)

    return {
      sourcePostId: lastPost.id,
      issue: Number(lastPost.issue) + 1,
      title: lastPost.title,
      summary: lastPost.summary,
      contentHidden: lastPost.contentHidden,
      type: lastPost.type,
      price: lastPost.price,
      publisherId: lastPost.publisher?.id,
      items: sortedItems.map((item) => ({
        typeId: item.lotteryType?.id,
        prediction: item.prediction,
        result: item.result,
      })),
    }
  }

  async generateDemoPost() {
    const [publisher, lotteryTypes, lastPost] = await Promise.all([
      this.userRepository.findOne({ where: { role: 'Admin' }, order: { id: 'ASC' } }) ??
        this.userRepository.findOne({ where: {}, order: { id: 'ASC' } }),
      this.lotteryTypeRepository.find({ order: { id: 'ASC' } }),
      this.postRepository.findOne({ order: { issue: 'DESC', createdAt: 'DESC' } }),
    ])

    if (!publisher) {
      throw new NotFoundException('暂无可用用户，无法生成演示帖子')
    }

    if (lotteryTypes.length === 0) {
      throw new NotFoundException('暂无彩种，无法生成演示帖子')
    }

    const nextIssue = Number(lastPost?.issue ?? 0) + 1
    const demoPost = await this.postRepository.save(
      this.postRepository.create({
        issue: nextIssue,
        title: `Demo Issue ${nextIssue}`,
        summary: `Auto generated demo data for issue ${nextIssue}.`,
        contentHidden: `Auto generated demo content for issue ${nextIssue}.`,
        type: 'FREE',
        price: 0,
        publisher,
      }),
    )

    const createdItems: PostItem[] = []
    for (const lotteryType of lotteryTypes) {
      const result = this.generateRandomResult()
      const prediction = this.generatePrediction(lotteryType, result)
      const config = lotteryType.config as LotteryEvaluationConfig
      let isWin = false

      try {
        isWin = this.ruleEngineService.evaluatePrediction(lotteryType.ruleType, config, prediction, result)
      } catch {
        isWin = false
      }

      const item = this.postItemRepository.create({
        post: demoPost,
        lotteryType,
        prediction,
        result,
        isWin,
      })
      createdItems.push(await this.postItemRepository.save(item))
    }

    return {
      postId: demoPost.id,
      issue: demoPost.issue,
      createdItems: createdItems.length,
      lotteryTypeIds: createdItems.map((item) => item.lotteryType.id),
    }
  }

  private generateRandomResult(): LotteryResultPayload {
    const zodiac = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
    return {
      number: this.randomInt(1, 49),
      zodiac: zodiac[this.randomInt(0, zodiac.length - 1)],
    }
  }

  private generatePrediction(lotteryType: LotteryType, result: LotteryResultPayload): PredictionData {
    const prediction: PredictionData = {}
    const config = lotteryType.config as LotteryEvaluationConfig
    const rules = Array.isArray(config?.rules) ? config.rules : []
    const tail = result.number % 10

    for (const rule of rules) {
      if (!rule.field) {
        continue
      }

      switch (rule.type) {
        case 'contains': {
          const numbers = new Set<number>([result.number])
          while (numbers.size < 5) {
            numbers.add(this.randomInt(1, 49))
          }
          prediction[rule.field] = Array.from(numbers)
          break
        }
        case 'zodiac_match':
          prediction[rule.field] = [result.zodiac ?? '鼠']
          break
        case 'tail_match':
          prediction[rule.field] = [tail]
          break
        case 'any_group_match': {
          if (Array.isArray(rule.groups) && rule.groups.length > 0) {
            prediction[rule.field] = rule.groups
          } else {
            const groupSize =
              typeof (lotteryType.config as Record<string, unknown>)?.group_size === 'number'
                ? Number((lotteryType.config as Record<string, unknown>).group_size)
                : 2
            const group = new Set<number>([result.number])
            while (group.size < groupSize) {
              group.add(this.randomInt(1, 49))
            }
            prediction[rule.field] = [Array.from(group)]
          }
          break
        }
        default:
          break
      }
    }

    if (Object.keys(prediction).length > 0) {
      return prediction
    }

    switch (lotteryType.ruleType) {
      case 'number':
        return { numbers: [this.randomInt(1, 49), this.randomInt(1, 49), this.randomInt(1, 49)] }
      case 'zodiac':
        return { zodiac: result.zodiac ?? '鼠' }
      case 'tail':
        return { tail }
      case 'combo':
        return { groups: [[this.randomInt(1, 49), this.randomInt(1, 49), this.randomInt(1, 49)]] }
      default:
        return { value: this.randomInt(1, 99) }
    }
  }

  private randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  async findAll(page = 1, limit = 20, userId?: number) {
    const [items, total] = await this.postRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['publisher', 'items', 'items.lotteryType'],
      order: { createdAt: 'DESC' },
    })

    const purchasedIds = new Set<number>()
    if (userId && items.length > 0) {
      const postIds = items.map((post) => post.id)
      const purchases = await this.purchaseRepository.find({
        where: { user: { id: userId }, post: { id: In(postIds) } },
        relations: ['post'],
      })
      purchases.forEach((purchase) => purchasedIds.add(purchase.post.id))
    }

    return {
      items: items.map((post) => ({
        ...post,
        contentHidden: post.type === 'FREE' || purchasedIds.has(post.id) ? post.contentHidden : null,
        purchased: post.type === 'FREE' || purchasedIds.has(post.id),
        isPurchased: post.type === 'FREE' || purchasedIds.has(post.id),
      })),
      total,
      page,
      limit,
    }
  }

  async findOne(postId: number, userId?: number) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['publisher', 'items', 'items.lotteryType'],
    })
    if (!post) {
      throw new NotFoundException('帖子不存在')
    }

    if (post.type === 'FREE') {
      return { ...post, purchased: true, isPurchased: true }
    }

    if (!userId) {
      return { ...post, contentHidden: null, purchased: false }
    }

    const purchase = await this.purchaseRepository.findOne({
      where: { user: { id: userId }, post: { id: post.id } },
    })

    return {
      ...post,
      contentHidden: purchase ? post.contentHidden : null,
      purchased: Boolean(purchase),
      isPurchased: Boolean(purchase),
    }
  }
}
