import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/cloudflare";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import tailwindcss from "~/tailwind.css";
import rubik400 from "@fontsource/rubik/400.css";
import rubik500 from "@fontsource/rubik/500.css";
import rubik600 from "@fontsource/rubik/600.css";
import rubik700 from "@fontsource/rubik/700.css";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: tailwindcss },
  { rel: "stylesheet", href: rubik400 },
  { rel: "stylesheet", href: rubik500 },
  { rel: "stylesheet", href: rubik600 },
  { rel: "stylesheet", href: rubik700 },
];

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
