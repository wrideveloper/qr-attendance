import type { MetaFunction } from "@remix-run/cloudflare";
import { Link, useParams } from "@remix-run/react";
import { useAtom } from "jotai";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { useEventSource } from "remix-utils/sse/react";
import { AttendanceCard } from "~/components/attendance/attendance-card";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import type { Attendance } from "~/schema/attendance";
import { attendanceAtom } from "~/stores/attendance";

const QR_UPDATE_DURATION = 10_000; // 5 seconds
const PROGRESS_UPDATE_DURATION = 100; // 100ms

export const meta: MetaFunction = () => {
	return [{ title: "Attendance | Workshop Riset Informatika" }];
};
export default function AttendancePage() {
	const params = useParams();

	const serverAttendances = useEventSource(`/sse/attendance/${params.id}`, { event: params.id });
	const randomUid = useEventSource(`/sse/random/${params.id}`, { event: params.id });
	const parsedAttendances: Attendance[] = serverAttendances === null ? [] : JSON.parse(serverAttendances);
	const [attendances, setAttendances] = useAtom(attendanceAtom);

	const [timeLeft, setTimeLeft] = useState(QR_UPDATE_DURATION);
	const progressValue = useMemo(() => (timeLeft / QR_UPDATE_DURATION) * 100, [timeLeft]);
	const qrTimeout = useRef<NodeJS.Timeout>();

	const updateRandomUid = useCallback(() => {
		return setTimeout(() => {
			if (timeLeft <= 0) {
				setTimeLeft(QR_UPDATE_DURATION);
				qrTimeout.current = updateRandomUid();
			} else {
				if (randomUid !== null) {
					setTimeLeft((prev) => prev - PROGRESS_UPDATE_DURATION);
				}
			}
		}, PROGRESS_UPDATE_DURATION);
	}, [randomUid, timeLeft]);

	useEffect(() => {
		qrTimeout.current = updateRandomUid();
		return () => clearTimeout(qrTimeout.current);
	}, [updateRandomUid]);

	useEffect(() => {
		(async () => {
			if (parsedAttendances.length <= 0) return;
			setAttendances((prev: Record<string, Attendance[]>) => ({
				...prev,
				[params.id as string]: parsedAttendances,
			}));
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [parsedAttendances]);

	useEffect(() => {
		if (randomUid === null) return;
		setTimeLeft(QR_UPDATE_DURATION);
	}, [randomUid]);

	return (
		<div className="flex flex-col items-center justify-center pt-32 gap-8">
			<div className="flex flex-col lg:flex-row gap-8 px-8">
				<div className="flex flex-col gap-2">
					<div className="w-[500px] h-[500px]">
						<QRCode
							size={480}
							style={{ height: "auto", maxWidth: "100%", width: "100%" }}
							value={randomUid ?? ""}
							ecLevel="H"
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
							{(attendances[params.id as string] ?? []).map((attendance) => (
								<AttendanceCard
									key={attendance.id}
									name={attendance.fullname}
									class={attendance.class}
									studyProgram={attendance.studyProgram}
									time={new Date(attendance.time)}
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
