import { Body, Controller, Get, Param, Patch, ParseIntPipe, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { Roles } from '../common/decorators/roles.decorator'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'

class UpdateBalanceDto {
  amount: number
}

class UpdateStatusDto {
  active: boolean
}

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll()
  }

  @Patch(':id/balance')
  async updateBalance(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateBalanceDto) {
    return this.usersService.updateBalance(id, payload.amount)
  }

  @Patch(':id/status')
  async updateStatus(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateStatusDto) {
    return this.usersService.setActive(id, payload.active)
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(
      createUserDto.username,
      createUserDto.password,
      createUserDto.phone,
      createUserDto.role,
    )
  }
}
