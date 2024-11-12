import { Prisma } from '@prisma/client';
import { returnCategoryObj } from 'src/category/return-category.object';

export const returnProductObj: Prisma.ProductSelect = {
  id: true,
  name: true,
  slug: true,
  image: true,
  description: true,
  price: true,
  createdAt: true,
  category: { select: returnCategoryObj },
};
