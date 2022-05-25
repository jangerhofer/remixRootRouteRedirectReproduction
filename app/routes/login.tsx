import { redirect, type ActionFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { session } from "~/session.server";

export let action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await session.parse(cookieHeader)) || {};

  const email = (await request.formData()).get("email");
  cookie.email = email;

  return redirect("/", {
    headers: {
      "Set-Cookie": await session.serialize(cookie),
    },
  });
};

export default function Screen() {
  return (
    <Form method="post">
      <input type="email" name="email" required />

      <button>Sign In</button>
    </Form>
  );
}
