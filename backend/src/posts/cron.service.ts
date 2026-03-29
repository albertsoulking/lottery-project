import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Post } from '../entities/post.entity'
import { User } from '../entities/user.entity'

const SANXIAO_OPTIONS = [
  '三连肖：鼠、牛、虎',
  '三连肖：兔、龙、蛇',
  '三连肖：马、羊、猴',
  '三连肖：鸡、狗、猪',
  '三连肖：鼠、龙、猴',
  '三连肖：牛、蛇、鸡',
  '三连肖：虎、马、狗',
  '三连肖：兔、羊、猪',
]

@Injectable()
export class PostsCronService {
  private readonly logger = new Logger(PostsCronService.name)

  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateDailySanXiao() {
    try {
      const publisher = await this.userRepository.findOne({ where: { active: true }, order: { id: 'ASC' } })
      if (!publisher) {
        this.logger.warn('未找到可用用户作为帖子发布者，跳过自动生成')
        return
      }

      const content = this.buildSanXiaoContent()
      const summary = `自动生成今日三肖内容，价格 10 金币`
      const post = this.postRepository.create({
        title: '每日自动三肖',
        summary,
        contentHidden: content,
        price: 10,
        type: 'PAID',
        publisher,
      })

      await this.postRepository.save(post)
      this.logger.log(`已生成自动帖子 ${post.id}`)
    } catch (error) {
      this.logger.error('生成自动帖子失败', error as Error)
    }
  }

  private buildSanXiaoContent() {
    const index = Math.floor(Math.random() * SANXIAO_OPTIONS.length)
    const option = SANXIAO_OPTIONS[index]
    const time = new Date().toLocaleString('zh-CN', { hour12: false })
    return `${option}。

提示：本条内容仅供参考，实际投注请谨慎。

发布时间：${time}`
  }
}
