import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common'
import { PostItemsService } from './post-items.service'
import { CreatePostItemDto } from './dto/create-post-item.dto'

@Controller('post-items')
export class PostItemsController {
  constructor(private readonly postItemsService: PostItemsService) {}

  @Get()
  findAll(@Query('postId') postId?: string, @Query('typeId') typeId?: string) {
    return this.postItemsService.findAll(
      postId ? Number(postId) : undefined,
      typeId ? Number(typeId) : undefined,
    )
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postItemsService.findOne(id)
  }

  @Post()
  create(@Body() dto: CreatePostItemDto) {
    return this.postItemsService.create(dto)
  }
}
