import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { eventStream } from "remix-utils/sse/server";
import { interval } from "remix-utils/timers";
import type { Attendance } from "~/schema/attendance";
import { getAllAttendances } from "~/services/attendance.server";

const REFRESH_INTERVAL = 5000;

export async function loader({ request, params, context }: LoaderFunctionArgs) {
	return eventStream(request.signal, (send) => {
		async function run() {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			for await (let _ of interval(REFRESH_INTERVAL, { signal: request.signal })) {
				const attendances = await getAllAttendances(
					context.ATTENDANCE_QUEUE as KVNamespace,
					params.id as string
				);
				// prevent duplicates with the same id and fullname
				const uniqueAttendees = attendances.reduce((acc, curr) => {
					if (acc.find((a) => a.id === curr.id || a.fullname === curr.fullname)) return acc;
					return acc.concat(curr);
				}, [] as Attendance[]);
				send({ event: params.id, data: JSON.stringify(uniqueAttendees) });
			}
		}
		run();
		return () => {};
	});
}
