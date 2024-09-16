import React, { useState, useEffect } from "react";
import { Form, json, useActionData, useLoaderData } from "@remix-run/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { findUserById } from "utils/dataOpreations/user/user";
import addQuestion from "../../utils/dataOpreations/Question/addQuestion";
import { useNavigate } from "@remix-run/react";
import {getAllQns} from "utils/dataOpreations/Question/Question";

interface Question {
  id: string;
  title: string;
  body: string;
  tags: { name: string }[];
}

export default function Index() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const actionData = useActionData<typeof action>();
  const LoaderData = useLoaderData<typeof action>();
  const [userId, setUserId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);

  useEffect(() => {
    if (Array.isArray(LoaderData)) {
      setQuestions(LoaderData);
    } else {
      console.error("LoaderData is undefined or not an array");
    }

    const storedData = localStorage.getItem("UserId");
    if (storedData) {
      setUserId(storedData);
    }
  }, [LoaderData])

  const handleShowModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate("/login");
  };

  if (questions === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center flex-row h-screen">
      {actionData?.error && (
        <div className="fixed top-0 left-0 w-full h-full flex bg-black bg-opacity-30 items-center justify-center z-10">
          <div className="p-4 w-84 h-61 rounded-xl shadow-2xl bg-white">
            <h2 className="text-xl font-semibold mb-2 text-base-neutral-focus text-center">
              Not Signed In
            </h2>
            <p className="mb-4 flex justify-center">
              Log in first to send a question
            </p>
            <div className="flex justify-center">
              <button
                className="btn btn-error bg-orange-400 w-93 h-13 border-none text-white"
                onClick={handleNavigation}
              >
                削除する
              </button>
            </div>
            <div className="flex justify-center">
              <button
                className="btn bg-white w-93 h-13 rounded-lg text-black my-2"
                onClick={handleShowModal}
                aria-label="Cancel"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      <Form className="flex flex-1 flex-col w-1/2 px-8 pt-16" method="post">
        <h1>Enter Questions</h1>
        <div className="flex flex-col gap-2 my-4">
          <label>Title</label>
          <input
            id="title"
            name="title"
            className="bg-slate-200 text-black rounded-xl p-2"
            type="text"
          />
        </div>
        <div className="flex flex-col gap-2 my-4">
          <label>Content</label>
          <textarea
            id="content"
            name="content"
            className="bg-slate-200 h-32 text-black rounded-xl p-2 border-spacing-1 border-gray-500 border"
          />
        </div>
        <input type="hidden" name="author_id" value={userId || ''} />
        <div className="flex flex-col gap-2 my-4">
          <label>Tags</label>
          <input
            placeholder="Enter tags separated by commas"
            id="tags"
            name="tags"
            className="bg-slate-200 text-black rounded-xl p-2"
            type="text"
          />
        </div>

        <button type="submit">Submit</button>
      </Form>

       <div className="flex-1 px-8 overflow-y-auto">
        {questions.length > 0 ? (
          questions.map((question) => (
            <div key={question.id} className="flex flex-col gap-2 my-4 p-4 border rounded shadow-sm">
              <h2 className="text-2xl font-bold">{question.title}</h2>
              <p>{question.body}</p>

              <div className="flex flex-wrap gap-2">
                {question.tags ? question.tags.map((tag) => (
                  <span key={tag.name} className="bg-slate-200 text-black rounded-xl p-2">
                    {tag.name}
                  </span>
                )):""}
                </div>
            </div>
          ))
        ) : (
          <div>No questions available</div>
        )}
      </div> 

    </div>
  );
};



export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();

    const title = formData.get("title") as string | null;
    const body = formData.get("content") as string | null;
    const author_id = Number(formData.get("author_id"));
    const tagsEntry = formData.get("tags");
    const user = await findUserById(author_id);


    if (!body || !title || typeof title !== "string" || title.trim() === "" || typeof body !== "string") {
      return { error: "Title and body are required" };
    }
    let tags: string[] = [];
    if (tagsEntry && typeof tagsEntry === "string") {
      tags = tagsEntry.split(",").map(tag => tag.trim());
    }
    if (!user) {
      return json({ error: "User not found" }, { status: 403 });
    }


    const question = await addQuestion({ title, body, author_id, tags });


    return { title: question.title };
  } catch (error) {
    console.error("Error in action function:", error);
    return { error: "An error occurred while processing your request" };
  }
};


export let loader: LoaderFunction = async () => {
  const posts = await getAllQns();
  return posts;
};