import { Body, Controller, Get, Param, Patch, Post, Query, ParseIntPipe, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreateLotteryDto } from './dto/create-lottery.dto'
import { LotteryService } from './lottery.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { RolesGuard } from '../common/guards/roles.guard'

@ApiTags('lottery')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
@Controller('lottery')
export class LotteryController {
  constructor(private readonly lotteryService: LotteryService) {}

  @Get()
  async findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.lotteryService.findAll(Number(page), Number(limit))
  }

  @Post()
  async create(@Body() dto: CreateLotteryDto) {
    return this.lotteryService.create(dto.phase, dto.numbers, dto.status)
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: 'DRAWN' | 'PENDING',
  ) {
    return this.lotteryService.updateStatus(id, status)
  }
}
