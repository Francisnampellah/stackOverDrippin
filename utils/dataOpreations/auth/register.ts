import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export async function addUser(userData: { name: string; email: string; password: string; }) {
    const { name, email, password } = userData;
  
    const user = await prisma.user.create({
      data: {
        username: name,
        email,
        password,
      },
    });
  
    return user;
  }