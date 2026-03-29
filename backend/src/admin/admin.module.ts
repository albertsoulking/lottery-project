import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BalanceLog } from '../entities/balance-log.entity'
import { Post } from '../entities/post.entity'
import { PurchaseRecord } from '../entities/purchase-record.entity'
import { User } from '../entities/user.entity'
import { AdminController } from './admin.controller'
import { TransactionsService } from '../transactions/transactions.service'

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, PurchaseRecord, BalanceLog])],
  controllers: [AdminController],
  providers: [TransactionsService],
})
export class AdminModule {}
