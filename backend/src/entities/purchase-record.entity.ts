import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Post } from './post.entity'
import { User } from './user.entity'

@Entity()
export class PurchaseRecord {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.purchases, { nullable: false })
  user: User

  @ManyToOne(() => Post, { nullable: false })
  post: Post

  @Column({ type: 'int' })
  amount: number

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  purchasedAt: Date
}
