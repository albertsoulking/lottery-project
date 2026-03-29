import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BalanceLog } from '../entities/balance-log.entity'
import { Post } from '../entities/post.entity'
import { PurchaseRecord } from '../entities/purchase-record.entity'
import { User } from '../entities/user.entity'
import { TransactionsController } from './transactions.controller'
import { TransactionsService } from './transactions.service'

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, PurchaseRecord, BalanceLog])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
