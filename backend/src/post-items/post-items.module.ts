import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostItem } from '../entities/post-item.entity'
import { Post } from '../entities/post.entity'
import { LotteryType } from '../entities/lottery-type.entity'
import { PostItemsController } from './post-items.controller'
import { PostItemsService } from './post-items.service'
import { LotteryModule } from '../lottery/lottery.module'

@Module({
  imports: [TypeOrmModule.forFeature([PostItem, Post, LotteryType]), LotteryModule],
  controllers: [PostItemsController],
  providers: [PostItemsService],
  exports: [PostItemsService],
})
export class PostItemsModule {}
