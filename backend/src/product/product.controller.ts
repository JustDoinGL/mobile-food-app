import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UsePipes(new ValidationPipe())
  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.productService.getAll(searchTerm);
  }

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.productService.bySlug(slug);
  }

  @Get('by-category/:category')
  async byCategory(@Param('category') category: string) {
    return this.productService.byCategory(category);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @Patch('id')
  async update(@Body() dto: UpdateProductDto, @Param('id') id: string) {
    return this.productService.update(id, dto);
  }

  @Delete('id')
  async delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
