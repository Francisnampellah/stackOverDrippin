import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addQuestion(questionData: { title: string; body: string; author_id: number; tags: string[]; }) {
    const { title, body, author_id, tags } = questionData;
  
    const question = await prisma.question.create({
      data: {
        title,
        body,
        author_id,
        tags: {
          connectOrCreate: tags.map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        },
      },
    });
  
    return question;
  }

  export default  addQuestion ;