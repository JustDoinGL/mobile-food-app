import { CategoryService } from './../category/category.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { generateSlug } from 'src/utils/generate-slug';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { returnProductObj } from './return-product.obj';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryService: CategoryService,
  ) {}

  async getAll(searchTerm?: string) {
    if (searchTerm) return this.search(searchTerm);

    return this.prisma.product.findMany({
      select: returnProductObj,
      orderBy: { createdAt: 'desc' },
    });
  }

  private async search(searchTerm: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          {
            name: { contains: searchTerm, mode: 'insensitive' },
            description: { contains: searchTerm, mode: 'insensitive' },
          },
        ],
      },
      select: returnProductObj,
    });
  }

  async bySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      select: returnProductObj,
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async byCategory(category: string) {
    const product = await this.prisma.product.findMany({
      where: { category: { slug: category } },
      select: returnProductObj,
    });

    if (!product) throw new NotFoundException('Products not found');

    return product;
  }

  // Для админ панели
  async create(dto: CreateProductDto) {
    await this.validateName(dto.name);

    await this.categoryService.byId(dto.categoryId);

    return this.prisma.product.create({
      data: { ...dto, slug: generateSlug(dto.name) },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.validateName(dto.name);

    await this.categoryService.byId(dto.categoryId);

    return this.prisma.product.update({
      where: { id },
      data: { ...dto, slug: generateSlug(dto.name) },
    });
  }

  async delete(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }

  private async validateName(name: string) {
    const product = await this.prisma.product.findUnique({ where: { name } });

    if (product) throw new BadRequestException('Name already exists');
  }
}
