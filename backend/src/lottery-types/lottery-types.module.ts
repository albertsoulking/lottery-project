import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LotteryType } from '../entities/lottery-type.entity'
import { LotteryTypesController } from './lottery-types.controller'
import { LotteryTypesService } from './lottery-types.service'

@Module({
  imports: [TypeOrmModule.forFeature([LotteryType])],
  controllers: [LotteryTypesController],
  providers: [LotteryTypesService],
  exports: [LotteryTypesService],
})
export class LotteryTypesModule {}
