import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PredictionPost } from '../entities/prediction-post.entity'
import { User } from '../entities/user.entity'
import { CreatePredictionDto } from './dto/create-prediction.dto'
import { LotteryService } from '../lottery/lottery.service'

@Injectable()
export class PredictionsService {
  constructor(
    @InjectRepository(PredictionPost) private readonly predictionRepository: Repository<PredictionPost>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly lotteryService: LotteryService,
  ) {}

  async findAll(page = 1, limit = 20) {
    const [items, total] = await this.predictionRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
      order: { createdAt: 'DESC' },
    })
    return { items, total, page, limit }
  }

  async create(createPredictionDto: CreatePredictionDto) {
    const { lotteryType, data, publisherId } = createPredictionDto
    await this.lotteryService.validatePrediction(lotteryType, data)

    const user = await this.userRepository.findOne({ where: { id: publisherId } })
    if (!user) {
      throw new NotFoundException('发布用户不存在')
    }

    const prediction = this.predictionRepository.create({
      lotteryType,
      data,
      user,
      status: 'valid',
    })
    return this.predictionRepository.save(prediction)
  }
}
