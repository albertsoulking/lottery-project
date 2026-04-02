import { Column, Entity, OneToMany, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'
import { PostItem } from './post-item.entity'

@Entity('lottery_types')
export class LotteryType {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ unique: true })
  code: string

  @Column({ type: 'enum', enum: ['number', 'zodiac', 'tail', 'combo'] })
  ruleType: 'number' | 'zodiac' | 'tail' | 'combo'

  @Column({ nullable: true })
  description?: string

  @Column({ type: 'json' })
  config: Record<string, unknown>

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @OneToMany(() => PostItem, (item) => item.lotteryType)
  postItems: PostItem[]
}
