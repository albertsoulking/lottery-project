import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Lottery {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  period: string

  @Column()
  result: string

  @CreateDateColumn()
  drawTime: Date
}
