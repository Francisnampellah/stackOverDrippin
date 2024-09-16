import React, { useState, useEffect } from "react";
import { Form, json, useActionData, useLoaderData } from "@remix-run/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { addUser } from "utils/dataOpreations/auth/register";
import { useNavigate } from "@remix-run/react";
import { getQnsById, addAnswer, getAnswersByQuestionId, addComment, getCommentsForAnswers } from "utils/dataOpreations/Question/Question";
import { getUserById } from "utils/dataOpreations/user/user";
import { c } from "node_modules/vite/dist/node/types.d-aGj9QkWt";
export default function Index() {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();

  const [userId, setUserId] = useState<any>();


  useEffect(() => {
    const Id = localStorage.getItem("UserId");
    console.log("ID", Id);
    setUserId(Id);
  }, []);


  console.log(userId)


  const navigate = useNavigate();


  return (
    <div className="flex flex-col  items-center">

      <div>
        <h1 className={"text-3xl font-bold"}>{loaderData.question.title}
        </h1>
        <p className={"p-8 text-red-300"} >{loaderData.question.body}</p>
        <span className="">{loaderData.user.username}</span>
      </div>

      <div className="flex p-16 flex-col">
        {
          loaderData.answers.map((answer: any) => {
            return (
              <div className="flex flex-col bg-slate-300 rounded-xl p-4 m-4">
                <span>{answer.body}</span>
                <span>{answer.author_id}</span>

                <div>
                  {
                    answer.comments.map((comment: any) => {
                      return (
                        <div className="flex flex-col bg-slate-300 rounded-xl p-4 m-4">
                          <span>{comment.body}</span>
                          <span>{comment.author_id}</span>
                        </div>
                      )
                    })
                  }
                </div>
                
                <Form method="post" className="flex flex-col rounded-xl">
                  <input type="hidden" name="formType" value="comment" />
                  <input className="bg-slate-300 rounded-2xl" type="text" name="comment" />
                  <input type="hidden" name="questionId" value={loaderData.question.id} />
                  <input type="hidden" name="answerId" value={answer.id} />
                  <input type="hidden" name="userId" value={userId} />
                  <button type="submit">Submit</button>
                </Form>
              </div>
            )
          })
        }
      </div>

      <div className="flex">
        <Form method="post" className="flex flex-col rounded-xl">
          <input type="hidden" name="formType" value='answer' />
          <input className="bg-slate-300 rounded-2xl" type="text" name="answer" />
          <input type="hidden" name="questionId" value={loaderData.question.id} />
          <input type="hidden" name="userId" value={loaderData.user.id} />
          <button type="submit">Submit</button>
        </Form>
      </div>

    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  try {

    const formData = new URLSearchParams(await request.text());
    const formType = formData.get("formType");

    if (formType === "comment") {

      const comment = formData.get("comment");
      const questionId = formData.get("questionId");
      const answerId = formData.get("answerId");
      const userId = formData.get("userId");

      console.log("=============================================================");

      console.log("comment " + comment, "qnid " + questionId, "ansId " + answerId, "userID " + userId);


      if (!comment || !questionId || !answerId || !userId) {
        return json({ error: "All fields are required" }, { status: 400 });
      }


      const newComment = await addComment(comment, parseInt(userId), parseInt(questionId), parseInt(answerId));
      return json({ newComment }, { status: 200 });
    }


    if (formType === "answer") {
      const answer = formData.get("answer");
      const questionId = formData.get("questionId");
      const userId = formData.get("userId");

      if (!answer || !questionId || !userId) {
        return json({ error: "All fields are required" }, { status: 400 });
      }

      const newAnswer = await addAnswer(parseInt(questionId), parseInt(userId), answer);

      return json({ newAnswer });
    }

  } catch (error) {
    console.error(error);
    return json({ error: "An error occurred while adding the comment" }, { status: 500 });
  }


  return json({ error: "Invalid form type" },
    { status: 400 });
};


export let loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  if (!id) {
    return json({ error: "Id is required" },
      { status: 400 });
  }

  const question = await getQnsById(parseInt(id));

  if (!question || question.author_id === undefined) {
    return json({ error: "Question not found or author_id is missing" },
      { status: 404 });
  }

  const user = await getUserById(question?.author_id);
  const answers = await getAnswersByQuestionId(parseInt(id));

  return json({ question, user, answers });
};