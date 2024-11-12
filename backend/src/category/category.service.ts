import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { returnCategoryObj } from './return-category.object';
import { UpdateCategoryDto, CreateCategoryDto } from './dto/category.dto';
import { generateSlug } from 'src/utils/generate-slug';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.category.findMany({ select: returnCategoryObj });
  }

  async byId(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      select: returnCategoryObj,
    });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async bySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      select: returnCategoryObj,
    });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  // Для админ панели
  async create(dto: CreateCategoryDto) {
    await this.validateName(dto.name);
    return this.prisma.category.create({
      data: { ...dto, slug: generateSlug(dto.name) },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.validateName(dto.name);
    return this.prisma.category.update({
      where: { id },
      data: { ...dto, slug: generateSlug(dto.name) },
    });
  }

  async delete(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }

  private async validateName(name: string) {
    const category = await this.prisma.category.findUnique({ where: { name } });

    if (category) throw new BadRequestException('Name already exists');
  }
}
