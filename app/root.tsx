import { captureRemixErrorBoundaryError } from "@sentry/remix";
import type { LinksFunction } from "@remix-run/node";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useRouteError,
} from "@remix-run/react";
import "~/tailwind.css";
import "@fontsource/rubik/400.css";
import "@fontsource/rubik/500.css";
import "@fontsource/rubik/600.css";
import "@fontsource/rubik/700.css";

export const ErrorBoundary = () => {
	const error = useRouteError();
	captureRemixErrorBoundaryError(error);
	return <div>Something went wrong</div>;
};

export async function loader() {
	return {
		env: {
			SENTRY_DSN: process.env.SENTRY_DSN,
			NODE_ENV: process.env.NODE_ENV,
		},
	};
}

export default function App() {
	const data = useLoaderData<typeof loader>();
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
				<script
					dangerouslySetInnerHTML={{
						__html: `window.env = ${JSON.stringify(data.env)}`,
					}}
				/>
				<Scripts />
			</body>
		</html>
	);
}
