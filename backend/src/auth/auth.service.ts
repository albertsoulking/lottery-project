import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username)
    if (!user || !user.active) {
      return null
    }
    const matches = await bcrypt.compare(password, user.password)
    if (!matches) {
      return null
    }
    return user
  }

  async login(user: { id: number; username: string; role: string }) {
    const payload = { username: user.username, sub: user.id, role: user.role }
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, username: user.username, role: user.role },
    }
  }

  async register(data: { username: string; password: string; phone?: string }) {
    const user = await this.usersService.createUser(data.username, data.password, data.phone)
    if (!user) {
      throw new UnauthorizedException('注册失败')
    }
    return { id: user.id, username: user.username, role: user.role }
  }
}
