import * as Sentry from "@sentry/remix";
/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { RemixBrowser, useLocation, useMatches } from "@remix-run/react";
import { startTransition, StrictMode, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";

Sentry.init({
	// we acquire the DSN from the window object that we injected from the root.tsx
	dsn: (window as any).env.SENTRY_DSN,
	environment: (window as any).env.NODE_ENV,
	tracesSampleRate: 0.25,
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1,

	integrations: [
		new Sentry.BrowserTracing({
			routingInstrumentation: Sentry.remixRouterInstrumentation(useEffect, useLocation, useMatches),
		}),
		new Sentry.Replay(),
	],
});

startTransition(() => {
	hydrateRoot(
		document,
		<StrictMode>
			<RemixBrowser />
		</StrictMode>
	);
});
