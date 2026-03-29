import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'

export type PostType = 'FREE' | 'PAID'

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column('text')
  summary: string

  @Column('text')
  contentHidden: string

  @Column({ type: 'int', default: 0 })
  price: number

  @Column({ type: 'enum', enum: ['FREE', 'PAID'], default: 'PAID' })
  type: PostType

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  publisher: User

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date
}
