import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'

export type BalanceChangeType = 'RECHARGE' | 'PURCHASE' | 'REWARD'

@Entity()
export class BalanceLog {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.balanceLogs, { nullable: false })
  user: User

  @Column({ type: 'int' })
  amount: number

  @Column({ type: 'enum', enum: ['RECHARGE', 'PURCHASE', 'REWARD'] })
  type: BalanceChangeType

  @Column({ type: 'int' })
  balanceAfter: number

  @Column({ nullable: true })
  remark?: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date
}
