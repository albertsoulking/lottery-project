import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

export type LotteryStatus = 'DRAWN' | 'PENDING'

@Entity()
export class LotteryRecord {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  phase: string

  @Column()
  numbers: string

  @Column({ type: 'timestamp' })
  drawAt: Date

  @Column({ type: 'enum', enum: ['DRAWN', 'PENDING'], default: 'PENDING' })
  status: LotteryStatus
}
