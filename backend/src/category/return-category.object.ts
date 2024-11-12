import { Prisma } from '@prisma/client';

export const returnCategoryObj: Prisma.CategorySelect = {
  id: true,
  name: true,
  slug: true,
  image: true,
};
