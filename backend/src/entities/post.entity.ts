import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'
import { PostItem } from './post-item.entity'

export type PostType = 'FREE' | 'PAID'

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int', default: 0 })
  issue: number

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

  @OneToMany(() => PostItem, (item) => item.post)
  items: PostItem[]

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date
}
