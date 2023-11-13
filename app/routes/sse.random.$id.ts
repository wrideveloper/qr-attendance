import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { eventStream } from "remix-utils/sse/server";
import { interval } from "remix-utils/timers";
import { generateRandomNanoId } from "~/services/nanoid.server";

const REFRESH_INTERVAL = 10_000;

export async function loader({ request, params, context }: LoaderFunctionArgs) {
	return eventStream(request.signal, (send) => {
		// send an event every REFRESH_INTERVAL
		(async () => {
			// send an initial event
			send({
				event: params.id,
				data: await generateRandomNanoId(context.NANOID_STORE as KVNamespace, params.id as string),
			});

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			for await (let _ of interval(REFRESH_INTERVAL, { signal: request.signal })) {
				send({
					event: params.id,
					data: await generateRandomNanoId(context.NANOID_STORE as KVNamespace, params.id as string),
				});
			}
		})();

		return () => {};
	});
}
