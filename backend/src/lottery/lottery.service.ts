import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LotteryRecord } from '../entities/lottery-record.entity'
import { lotteryConfigs, getLotteryConfig } from './lottery-config'
import { RuleEngineService } from './rule-engine.service'

@Injectable()
export class LotteryService {
  constructor(
    @InjectRepository(LotteryRecord) private readonly lotteryRepository: Repository<LotteryRecord>,
    private readonly ruleEngineService: RuleEngineService,
  ) {}

  getConfigs() {
    return lotteryConfigs.map(({ lotteryType, label, fields }) => ({ lotteryType, label, fields }))
  }

  validatePrediction(lotteryType: string, data: Record<string, unknown>) {
    const config = getLotteryConfig(lotteryType)
    if (!config) {
      throw new BadRequestException('未知彩种类型')
    }
    return this.ruleEngineService.validate(lotteryType, data)
  }

  async findAll(page = 1, limit = 20) {
    const [items, total] = await this.lotteryRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { drawAt: 'DESC' },
    })
    return { items, total, page, limit }
  }

  async create(phase: string, numbers: string, status: 'DRAWN' | 'PENDING') {
    const entity = this.lotteryRepository.create({ phase, numbers, status, drawAt: new Date() })
    return this.lotteryRepository.save(entity)
  }

  async updateStatus(id: number, status: 'DRAWN' | 'PENDING') {
    const record = await this.lotteryRepository.findOne({ where: { id } })
    if (!record) {
      throw new NotFoundException('开奖记录不存在')
    }
    record.status = status
    return this.lotteryRepository.save(record)
  }
}
