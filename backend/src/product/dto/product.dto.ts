import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsString()
  categoryId: string;

  @IsNumber()
  price: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
