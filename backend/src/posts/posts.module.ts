import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Post } from '../entities/post.entity'
import { PurchaseRecord } from '../entities/purchase-record.entity'
import { User } from '../entities/user.entity'
import { PostsController } from './posts.controller'
import { PostsService } from './posts.service'
import { PostsCronService } from './cron.service'

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, PurchaseRecord])],
  controllers: [PostsController],
  providers: [PostsService, PostsCronService],
  exports: [PostsService],
})
export class PostsModule {}
