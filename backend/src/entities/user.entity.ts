import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { BalanceLog } from './balance-log.entity'
import { Post } from './post.entity'
import { PredictionPost } from './prediction-post.entity'
import { PurchaseRecord } from './purchase-record.entity'

export type UserRole = 'Admin' | 'User' | 'Test'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @Column({ unique: true, nullable: true })
  phone?: string

  @Column({ type: 'int', default: 0 })
  balance: number

  @Column({ type: 'enum', enum: ['Admin', 'User', 'Test'], default: 'Test' })
  role: UserRole

  @Column({ default: true })
  active: boolean

  @CreateDateColumn()
  createdAt: Date

  @OneToMany(() => Post, (post) => post.publisher)
  posts: Post[]

  @OneToMany(() => PredictionPost, (prediction) => prediction.user)
  predictionPosts: PredictionPost[]

  @OneToMany(() => PurchaseRecord, (purchase) => purchase.user)
  purchases: PurchaseRecord[]

  @OneToMany(() => BalanceLog, (log) => log.user)
  balanceLogs: BalanceLog[]
}
