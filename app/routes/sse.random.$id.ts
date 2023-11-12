import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { eventStream } from "remix-utils/sse/server";
import { interval } from "remix-utils/timers";
import { generateRandomNanoId } from "~/services/nanoid.server";

const REFRESH_INTERVAL = 10_000;

export async function loader({ request, params }: LoaderFunctionArgs) {
	return eventStream(request.signal, (send) => {
		// send an initial event
		send({
			event: params.id,
			data: generateRandomNanoId(params.id as string),
		});

		// send an event every REFRESH_INTERVAL
		(async () => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			for await (let _ of interval(REFRESH_INTERVAL, { signal: request.signal })) {
				send({
					event: params.id,
					data: generateRandomNanoId(params.id as string),
				});
			}
		})();

		return () => {};
	});
}
