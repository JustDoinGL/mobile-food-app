import { Prisma } from '@prisma/client';

export const returnUserObj: Prisma.UserSelect = {
  id: true,
  name: true,
  avatarPath: true,
  email: true,
  password: false,
  phone: true,
};
