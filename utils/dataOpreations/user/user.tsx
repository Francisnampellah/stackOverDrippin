import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function findUserById(id: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return user;
}

export async function getUserById(id: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  return user;
}