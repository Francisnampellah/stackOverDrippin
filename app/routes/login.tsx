import React, { useState, useEffect } from "react";
import { Form, json, useActionData } from "@remix-run/react";
import { ActionFunction } from "@remix-run/node";
import { addUser } from "utils/dataOpreations/auth/register";
import { useNavigate } from "@remix-run/react";

export default function Index() {
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();

  const [userId, setUserId] = useState<any>();

  const handleSave = (Id: any) => {
    localStorage.setItem("UserId", Id);
    setUserId(Id);
  };

  useEffect(() => {
    if (actionData?.userId) {
      handleSave(actionData.userId); 
      navigate('/');  
    }
  }, [actionData, navigate]); 

  return (
    <div className="flex justify-center items-center">
      <Form method="post">
        {actionData?.message && <p>{actionData.message}</p>}
        {actionData?.error && <p className="text-red-500">{actionData.error}</p>}

        <div className="flex flex-col gap-2 my-4">
          <label>User name</label>
          <input id="username" name="username" className="bg-slate-200 text-black rounded-xl p-2" type="text" />
        </div>
        <div className="flex flex-col gap-2 my-4">
          <label>E-mail</label>
          <input id="email" name="email" className="bg-slate-200 text-black rounded-xl p-2" type="text" />
        </div>
        <div className="flex flex-col gap-2 my-4">
          <label>Password</label>
          <input id="password" name="password" className="bg-slate-200 text-black rounded-xl p-2" type="text" />
        </div>
        <div className="flex flex-col gap-2 my-4">
          <label>Confirm Password</label>
          <input id="confirmPassword" name="confirmPassword" className="bg-slate-200 text-black rounded-xl p-2" type="text" />
        </div>

        <button className="btn bg-green-500 text-white rounded-lg p-2" type="submit">Submit</button>
      </Form>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const data = new URLSearchParams(await request.text());
  const username = data.get("username");
  const email = data.get("email");
  const password = data.get("password");
  const confirmPassword = data.get("confirmPassword");

  if (!username || !email || !password || !confirmPassword) {
    return json({ error: "All fields are required" }, { status: 400 });
  }
  if (password !== confirmPassword) {
    return json({ error: "Passwords do not match" }, { status: 400 });
  }

  const response = await addUser({ name: username, email, password });

  if (!response.username) {
    return json({ error: "Failed to register user" }, { status: 400 });
  }

  return json({ message: "User registered successfully", userId: response.id });
};
