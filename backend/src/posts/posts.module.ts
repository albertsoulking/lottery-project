import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Post } from '../entities/post.entity'
import { PurchaseRecord } from '../entities/purchase-record.entity'
import { User } from '../entities/user.entity'
import { LotteryType } from '../entities/lottery-type.entity'
import { PostItem } from '../entities/post-item.entity'
import { PostsController } from './posts.controller'
import { PostsService } from './posts.service'
import { PostsCronService } from './cron.service'
import { LotteryModule } from '../lottery/lottery.module'

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, PurchaseRecord, LotteryType, PostItem]), LotteryModule],
  controllers: [PostsController],
  providers: [PostsService, PostsCronService],
  exports: [PostsService],
})
export class PostsModule {}
