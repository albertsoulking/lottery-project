import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { PostsModule } from './posts/posts.module'
import { LotteryModule } from './lottery/lottery.module'
import { PredictionsModule } from './predictions/predictions.module'
import { TransactionsModule } from './transactions/transactions.module'
import { AdminModule } from './admin/admin.module'
import { BalanceLog } from './entities/balance-log.entity'
import { ScheduleModule } from '@nestjs/schedule'
import { Lottery } from './entities/lottery.entity'
import { LotteryRecord } from './entities/lottery-record.entity'
import { LotteryType } from './entities/lottery-type.entity'
import { Post } from './entities/post.entity'
import { PostItem } from './entities/post-item.entity'
import { PredictionPost } from './entities/prediction-post.entity'
import { PurchaseRecord } from './entities/purchase-record.entity'
import { User } from './entities/user.entity'
import { LotteryTypesModule } from './lottery-types/lottery-types.module'
import { PostItemsModule } from './post-items/post-items.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'lottery_db',
      entities: [User, Post, PostItem, LotteryType, PredictionPost, Lottery, LotteryRecord, PurchaseRecord, BalanceLog],
      synchronize: true,
      logging: false,
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    LotteryModule,
    PredictionsModule,
    TransactionsModule,
    LotteryTypesModule,
    PostItemsModule,
    AdminModule,
  ],
})
export class AppModule {}
