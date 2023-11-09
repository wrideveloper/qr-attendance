import type { MetaFunction } from "@remix-run/node";
import { Link, useParams } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { useEventSource } from "remix-utils/sse/react";
import { AttendanceCard } from "~/components/attendance/attendance-card";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { storeAttendances } from "~/services/attendance";
import type { Attendance } from "~/schema/attendance";

const QR_UPDATE_DURATION = 10_000; // 5 seconds
const PROGRESS_UPDATE_DURATION = 100; // 100ms

export const meta: MetaFunction = () => {
	return [{ title: "Attendance | Workshop Riset Informatika" }];
};
export default function AttendancePage() {
	const params = useParams();
	const attendances = useEventSource(`/sse/attendance/${params.id}`, { event: params.id });
	const parsedAttendances = useMemo<Attendance[]>(
		() => (attendances === null ? [] : JSON.parse(attendances)),
		[attendances]
	);
	const [randomUid, setRandomUid] = useState(nanoid());
	const [timeLeft, setTimeLeft] = useState(QR_UPDATE_DURATION);
	const progressValue = (timeLeft / QR_UPDATE_DURATION) * 100;
	const qrTimeout = useRef<NodeJS.Timeout>();

	const updateRandomUid = useCallback(() => {
		return setTimeout(() => {
			if (timeLeft <= 0) {
				setRandomUid(nanoid());
				setTimeLeft(QR_UPDATE_DURATION);
				qrTimeout.current = updateRandomUid();
			} else {
				setTimeLeft((prev) => prev - PROGRESS_UPDATE_DURATION);
			}
		}, PROGRESS_UPDATE_DURATION);
	}, [timeLeft]);

	useEffect(() => {
		updateRandomUid();
		return () => clearTimeout(qrTimeout.current);
	}, [updateRandomUid]);

	useEffect(() => {
		(async () => {
			if (parsedAttendances.length <= 0) return;
			await storeAttendances(params.id as string, parsedAttendances);
		})();
	}, [params.id, parsedAttendances]);

	return (
		<div className="flex flex-col items-center justify-center h-full gap-8">
			<div className="flex gap-8">
				<div className="flex flex-col gap-2">
					<div className="w-[500px] h-[500px]">
						<QRCode
							size={480}
							style={{ height: "auto", maxWidth: "100%", width: "100%" }}
							value={randomUid}
							logoImage="/wri-logo-small.png"
							removeQrCodeBehindLogo
							logoPadding={8}
							logoWidth={120}
							logoHeight={128}
						/>
					</div>
					<Progress value={progressValue} className="bg-slate-300 h-4" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-slate-800">Attendance</h1>
					<p className="text-gray-500">Scan the QR code with your phone to mark your attendance.</p>
					<Separator className="my-4" />
					<ScrollArea className="w-[480px] h-[420px]">
						<div className="flex flex-col gap-2 pr-4">
							{parsedAttendances.map((attendance) => (
								<AttendanceCard
									key={attendance.id}
									name={attendance.fullname}
									class={attendance.class}
									studyProgram={attendance.studyProgram}
									time={attendance.time}
								/>
							))}
						</div>
					</ScrollArea>
				</div>
			</div>
			<Link to="/">
				<Button className="flex gap-2 w-full">
					<ArrowLeft />
					Back
				</Button>
			</Link>
		</div>
	);
}
