import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getAllQns() {
  
    const question = await prisma.question.findMany();
  
    return question;
  }

  export default  getAllQns ;