import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { session } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const { email } = (await session.parse(cookieHeader)) || {};

  if (email) {
    return redirect("/content");
  } else {
    return redirect("/login");
  }
};
