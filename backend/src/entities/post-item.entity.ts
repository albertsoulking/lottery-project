import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'
import { Post } from './post.entity'
import { LotteryType } from './lottery-type.entity'

@Entity('post_items')
export class PostItem {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Post, (post) => post.items, { nullable: false, onDelete: 'CASCADE' })
  post: Post

  @ManyToOne(() => LotteryType, (type) => type.postItems, { nullable: false })
  lotteryType: LotteryType

  @Column({ type: 'json' })
  prediction: Record<string, unknown>

  @Column({ type: 'json' })
  result: Record<string, unknown>

  @Column({ default: false })
  isWin: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
