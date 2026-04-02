import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class PredictionPost {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.predictionPosts, { nullable: false })
  user: User

  @Column()
  lotteryType: string

  @Column({ type: 'json' })
  data: Record<string, unknown>

  @Column({ type: 'enum', enum: ['pending', 'valid', 'invalid'], default: 'pending' })
  status: 'pending' | 'valid' | 'invalid'

  @CreateDateColumn()
  createdAt: Date
}
