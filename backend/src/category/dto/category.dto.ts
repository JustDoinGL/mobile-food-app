import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  image: string;

  @IsString()
  name: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
