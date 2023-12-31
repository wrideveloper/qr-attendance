import type { LoaderFunctionArgs } from "@remix-run/node";
import { eventStream } from "remix-utils/sse/server";
import { interval } from "remix-utils/timers";
import { createToken } from "~/services/token";

const REFRESH_INTERVAL = 10_000;

export async function loader({ request, params, context }: LoaderFunctionArgs) {
	const key = process.env.TOKEN_SECRET as string;
	return eventStream(request.signal, (send) => {
		// send an event every REFRESH_INTERVAL
		(async () => {
			// send an initial event
			const token = await createToken(key, params.id as string);
			send({
				event: params.id,
				data: token,
			});

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			for await (let _ of interval(REFRESH_INTERVAL, { signal: request.signal })) {
				const token = await createToken(key, params.id as string);
				send({
					event: params.id,
					data: token,
				});
			}
		})();

		return () => {};
	});
}
