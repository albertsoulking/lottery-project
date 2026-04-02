import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PostItem } from '../entities/post-item.entity'
import { Post } from '../entities/post.entity'
import { LotteryType } from '../entities/lottery-type.entity'
import { RuleEngineService, LotteryResultPayload, PredictionData, LotteryEvaluationConfig } from '../lottery/rule-engine.service'
import { CreatePostItemDto } from './dto/create-post-item.dto'

@Injectable()
export class PostItemsService {
  constructor(
    @InjectRepository(PostItem) private readonly postItemRepository: Repository<PostItem>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(LotteryType) private readonly lotteryTypeRepository: Repository<LotteryType>,
    private readonly ruleEngineService: RuleEngineService,
  ) {}

  findAll(postId?: number, typeId?: number) {
    const where: Record<string, unknown> = {}
    if (postId) {
      where.post = { id: postId }
    }
    if (typeId) {
      where.lotteryType = { id: typeId }
    }

    return this.postItemRepository.find({
      where,
      relations: ['post', 'lotteryType'],
      order: { createdAt: 'DESC' },
    })
  }

  async findOne(id: number) {
    const item = await this.postItemRepository.findOne({
      where: { id },
      relations: ['post', 'lotteryType'],
    })
    if (!item) {
      throw new NotFoundException('Post item not found')
    }
    return item
  }

  async create(dto: CreatePostItemDto) {
    const post = await this.postRepository.findOne({ where: { id: dto.postId } })
    if (!post) {
      throw new NotFoundException('Post not found')
    }

    const lotteryType = await this.lotteryTypeRepository.findOne({ where: { id: dto.typeId } })
    if (!lotteryType) {
      throw new NotFoundException('Lottery type not found')
    }

    const prediction = dto.prediction as PredictionData
    const result = dto.result as LotteryResultPayload
    const config = lotteryType.config as LotteryEvaluationConfig

    const isWin = this.ruleEngineService.evaluatePrediction(lotteryType.ruleType, config, prediction, result)

    const entity = this.postItemRepository.create({
      post,
      lotteryType,
      prediction,
      result,
      isWin,
    })
    return this.postItemRepository.save(entity)
  }
}
