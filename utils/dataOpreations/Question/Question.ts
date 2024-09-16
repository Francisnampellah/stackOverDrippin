import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllQns() {
  
    const question = await prisma.question.findMany();
  
    return question;
  }

  export async function getQnsById(id: number) {
  
    const question = await prisma.question.findUnique({
      where: {
        id: id,
      },
    });
  
    return question;
  }


  export async function addComment(body: string, author_id: number, question_id: number, answer_id: number) {
    
    console.log(body, author_id, question_id, answer_id);

    
    const newComment = await prisma.comment.create({
      data: {
        body: body,
        author_id: author_id,
        question_id: question_id,
        answer_id: answer_id,
      },
    });
  
    return newComment;
  }

export async function addAnswer(questionId: number, userId: number, content: string) {

  
  const answer = await prisma.answer.create({
    data: {
      body: content,
      question: {
        connect: {
          id: questionId,
        },
      },
      author: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return answer;
}

// export async function getAnswersByQuestionId(questionId: number) {
//   const answers = await prisma.answer.findMany({
//     where: {
//       question_id: questionId,
//     },
//   });

//   return answers;
// }

export async function getCommentsByAnswerId(answerId: number) {
  const comments = await prisma.comment.findMany({
    where: {
      answer_id: answerId,
    },
  });

  return comments;
}

export async function getCommentsForAnswers(questionId: number) {
  const answers = await getAnswersByQuestionId(questionId);
  if (!answers) {
    return [];
  }
  const answersWithComments = await Promise.all(answers?.map(async (answer) => {
    const comments = await getCommentsByAnswerId(answer.id);
    return {
      ...answer,
      comments,
    };
  }))}

  export async function getAnswersByQuestionId(questionId: number) {
    const answers = await prisma.answer.findMany({
      where: {
        question_id: questionId,
      },
      include: {
        comments: true,
      },
    });
  
    return answers;
  }
