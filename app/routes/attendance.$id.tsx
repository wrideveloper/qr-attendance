import { ScrollArea } from "@radix-ui/react-scroll-area";
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useRef, useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Separator } from "~/components/ui/separator";

const QR_UPDATE_DURATION = 10_000; // 5 seconds
const PROGRESS_UPDATE_DURATION = 100; // 100ms

export const meta: MetaFunction = () => {
	return [{ title: "Attendance | Workshop Riset Informatika" }];
};

export default function AttendancePage() {
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
		console.log({ timeLeft });
	}, [timeLeft]);

	return (
		<div>
			<div className="flex gap-4">
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
					<h1 className="text-2xl font-bold">Attendance</h1>
					<p className="text-gray-500">Scan the QR code with your phone to mark your attendance.</p>
					<Separator className="my-4" />
					<ScrollArea className="w-[480px] h-[480px]">
						<Card className="flex items-center justify-between p-4">
							<div className="flex flex-col">
								<span className="text-xl font-medium">Manusia Bernapas</span>
								<span className="text-sm text-slate-800">2I - Teknik Informatika</span>
							</div>
							<span className="text-lg">21:32</span>
						</Card>
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
