import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { session } from "./session.server";

type LoaderData = {
  email?: string;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const cookieHeader = request.headers.get("Cookie");
  const { email } = (await session.parse(cookieHeader)) || {};

  console.log("\nRoot loader sees: ", { email }, "\n");

  return {
    email,
  };
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const { email } = useLoaderData<LoaderData>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {email ? <h1>User: {email}</h1> : null}

        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
