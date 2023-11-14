import { logDevReady } from "@remix-run/cloudflare";
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";

if (process.env.NODE_ENV === "development") {
	logDevReady(build);
}

export const onRequest = createPagesFunctionHandler({
	build,
	getLoadContext: (context) => {
		return {
			env: context.env,
			NANOID_STORE: context.env.NANOID_STORE,
			ATTENDANCE_QUEUE: context.env.ATTENDANCE_QUEUE,
		};
	},
	mode: build.mode,
});
