import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { RolesGuard } from '../common/guards/roles.guard'
import { PredictionsService } from './predictions.service'
import { CreatePredictionDto } from './dto/create-prediction.dto'

@ApiTags('predictions')
@Controller('predictions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles('Admin')
export class PredictionsController {
  constructor(private readonly predictionsService: PredictionsService) {}

  @Get()
  async findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.predictionsService.findAll(Number(page), Number(limit))
  }

  @Post()
  async create(@Body() createPredictionDto: CreatePredictionDto) {
    return this.predictionsService.create(createPredictionDto)
  }
}
