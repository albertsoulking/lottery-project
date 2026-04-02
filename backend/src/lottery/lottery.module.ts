import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LotteryRecord } from '../entities/lottery-record.entity'
import { LotteryController } from './lottery.controller'
import { LotteryService } from './lottery.service'
import { RuleEngineService } from './rule-engine.service'

@Module({
  imports: [TypeOrmModule.forFeature([LotteryRecord])],
  controllers: [LotteryController],
  providers: [LotteryService, RuleEngineService],
  exports: [LotteryService, RuleEngineService],
})
export class LotteryModule {}
