import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Post } from '../entities/post.entity'
import { User } from '../entities/user.entity'
import { CreatePostDto } from './dto/create-post.dto'
import { PurchaseRecord } from '../entities/purchase-record.entity'

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(PurchaseRecord) private readonly purchaseRepository: Repository<PurchaseRecord>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const publisher = await this.userRepository.findOne({ where: { id: createPostDto.publisherId } })
    if (!publisher) {
      throw new NotFoundException('发布者不存在')
    }
    const entity = this.postRepository.create({
      title: createPostDto.title,
      summary: createPostDto.summary,
      contentHidden: createPostDto.contentHidden,
      price: createPostDto.price,
      type: createPostDto.type,
      publisher,
    })
    return this.postRepository.save(entity)
  }

  async findAll(page = 1, limit = 20, userId?: number) {
    const [items, total] = await this.postRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['publisher'],
      order: { createdAt: 'DESC' },
    })

    const purchasedIds = new Set<number>()
    if (userId && items.length > 0) {
      const postIds = items.map((post) => post.id)
      const purchases = await this.purchaseRepository.find({
        where: { user: { id: userId }, post: { id: In(postIds) } },
        relations: ['post'],
      })
      purchases.forEach((purchase) => purchasedIds.add(purchase.post.id))
    }

    return {
      items: items.map((post) => ({
        ...post,
        contentHidden: post.type === 'FREE' || purchasedIds.has(post.id) ? post.contentHidden : null,
        purchased: post.type === 'FREE' || purchasedIds.has(post.id),
        isPurchased: post.type === 'FREE' || purchasedIds.has(post.id),
      })),
      total,
      page,
      limit,
    }
  }

  async findOne(postId: number, userId?: number) {
    const post = await this.postRepository.findOne({ where: { id: postId }, relations: ['publisher'] })
    if (!post) {
      throw new NotFoundException('帖子不存在')
    }

    if (post.type === 'FREE') {
      return { ...post, purchased: true, isPurchased: true }
    }

    if (!userId) {
      return { ...post, contentHidden: null, purchased: false }
    }

    const purchase = await this.purchaseRepository.findOne({
      where: { user: { id: userId }, post: { id: post.id } },
    })

    return {
      ...post,
      contentHidden: purchase ? post.contentHidden : null,
      purchased: Boolean(purchase),
      isPurchased: Boolean(purchase),
    }
  }
}
