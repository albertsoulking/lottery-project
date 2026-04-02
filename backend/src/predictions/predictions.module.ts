import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PredictionsController } from './predictions.controller'
import { PredictionsService } from './predictions.service'
import { PredictionPost } from '../entities/prediction-post.entity'
import { User } from '../entities/user.entity'
import { LotteryModule } from '../lottery/lottery.module'

@Module({
  imports: [TypeOrmModule.forFeature([PredictionPost, User]), LotteryModule],
  controllers: [PredictionsController],
  providers: [PredictionsService],
})
export class PredictionsModule {}
