import { Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { RolesGuard } from '../common/guards/roles.guard'
import { LotteryTypesService } from './lottery-types.service'

@ApiTags('lottery-types')
@Controller('lottery-types')
export class LotteryTypesController {
  constructor(private readonly lotteryTypesService: LotteryTypesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('Admin')
  @Get()
  findAll() {
    return this.lotteryTypesService.findAll()
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('Admin')
  @Post('reset')
  async reset() {
    const types = await this.lotteryTypesService.resetLotteryTypes()
    return {
      message: 'Lottery types have been reset to default seed data.',
      types,
    }
  }
}
