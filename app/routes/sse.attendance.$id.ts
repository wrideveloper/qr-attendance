import type { LoaderFunctionArgs } from "@remix-run/node";
import { eventStream } from "remix-utils/sse/server";
import { interval } from "remix-utils/timers";
import { getAllAttendances } from "~/services/attendance.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
	return eventStream(request.signal, (send) => {
		async function run() {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			for await (let _ of interval(1000, { signal: request.signal })) {
				const attendances = await getAllAttendances(params.id as string);
				send({ event: params.id, data: JSON.stringify(attendances) });
			}
		}
		run();
		return () => {};
	});
}
