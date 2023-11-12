import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { eventStream } from "remix-utils/sse/server";
import { interval } from "remix-utils/timers";
import type { Attendance } from "~/schema/attendance";
import { getAllAttendances } from "~/services/attendance.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
	return eventStream(request.signal, (send) => {
		async function run() {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			for await (let _ of interval(1000, { signal: request.signal })) {
				const attendances = await getAllAttendances(params.id as string);
				const uniqueAttendees = attendances.reduce((acc, curr) => {
					if (acc.find((a) => a.id === curr.id)) return acc;
					return acc.concat(curr);
				}, [] as Attendance[]);
				send({ event: params.id, data: JSON.stringify(uniqueAttendees) });
			}
		}
		run();
		return () => {};
	});
}
