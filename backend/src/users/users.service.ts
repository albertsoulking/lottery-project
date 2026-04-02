import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { User, UserRole } from '../entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } })
  }

  findById(id: number) {
    return this.userRepository.findOne({ where: { id } })
  }

  async findAll() {
    return this.userRepository.find({ order: { createdAt: 'DESC' } })
  }

  async createUser(username: string, password: string, phone?: string, role: UserRole = 'Test') {
    const hashed = await bcrypt.hash(password, 10)
    const entity = this.userRepository.create({ username, password: hashed, phone, role, balance: 0, active: true })
    return this.userRepository.save(entity)
  }

  async create(createUserDto: CreateUserDto) {
    const { username, password, phone, role = 'Test' } = createUserDto
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = this.userRepository.create({
      username,
      password: hashedPassword,
      phone,
      role,
      balance: 0,
      active: true,
    })
    return this.userRepository.save(newUser)
  }

  async updateBalance(userId: number, amount: number) {
    const user = await this.findById(userId)
    if (!user) {
      throw new NotFoundException('用户不存在')
    }
    user.balance = amount
    return this.userRepository.save(user)
  }

  async setActive(userId: number, active: boolean) {
    const user = await this.findById(userId)
    if (!user) {
      throw new NotFoundException('用户不存在')
    }
    user.active = active
    return this.userRepository.save(user)
  }
}
