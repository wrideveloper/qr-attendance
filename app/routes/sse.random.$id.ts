import type { LoaderFunctionArgs } from "@remix-run/node";
import { nanoid } from "nanoid";
import { eventStream } from "remix-utils/sse/server";
import { interval } from "remix-utils/timers";

export const NANOID_GLOBAL_STORE = new Map<string, string[]>();
const REFRESH_INTERVAL = 10_000;

export type RandomUid = {
	randomUid: string;
	expiredAt: number;
};

export async function loader({ request, params }: LoaderFunctionArgs) {
	return eventStream(request.signal, (send) => {
		async function run() {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			for await (let _ of interval(REFRESH_INTERVAL, { signal: request.signal })) {
				const randomUid = nanoid();
				send({
					event: params.id,
					data: JSON.stringify({
						randomUid,
						expiredAt: Date.now() + REFRESH_INTERVAL,
					}),
				});
			}
		}
		run();
		return () => {};
	});
}
