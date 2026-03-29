import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { PostsModule } from './posts/posts.module'
import { LotteryModule } from './lottery/lottery.module'
import { TransactionsModule } from './transactions/transactions.module'
import { AdminModule } from './admin/admin.module'
import { BalanceLog } from './entities/balance-log.entity'
import { ScheduleModule } from '@nestjs/schedule'
import { LotteryRecord } from './entities/lottery-record.entity'
import { Post } from './entities/post.entity'
import { PurchaseRecord } from './entities/purchase-record.entity'
import { User } from './entities/user.entity'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_DATABASE || 'lottery_db',
      entities: [User, Post, LotteryRecord, PurchaseRecord, BalanceLog],
      synchronize: true,
      logging: false,
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    LotteryModule,
    TransactionsModule,
    AdminModule,
  ],
})
export class AppModule {}
