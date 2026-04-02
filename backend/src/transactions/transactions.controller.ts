import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { PurchaseDto } from './dto/purchase.dto'
import { TransactionsService } from './transactions.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { RolesGuard } from '../common/guards/roles.guard'

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('purchase')
  async purchase(@Req() req: any, @Body() dto: PurchaseDto) {
    return this.transactionsService.purchase(req.user.id, dto.postId)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('Admin')
  @Get('logs')
  async logs(@Query('page') page = '1', @Query('limit') limit = '50') {
    return this.transactionsService.findAllLogs(Number(page), Number(limit))
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('Admin')
  @Get('finance-summary')
  async financeSummary() {
    return this.transactionsService.getTodaySummary()
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('Admin')
  @Get('finance-trend')
  async financeTrend() {
    return this.transactionsService.getWeeklyTrend()
  }
}
