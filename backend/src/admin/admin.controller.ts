import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AdjustBalanceDto } from '../transactions/dto/adjust-balance.dto'
import { TransactionsService } from '../transactions/transactions.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { RolesGuard } from '../common/guards/roles.guard'

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('Admin')
  @Post('adjust-balance')
  async adjustBalance(@Body() dto: AdjustBalanceDto) {
    return this.transactionsService.adjustBalance(dto.userId, dto.amount, dto.remark)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('Admin')
  @Get('finance-summary')
  async financeSummary() {
    return this.transactionsService.getFinanceSummary()
  }
}
