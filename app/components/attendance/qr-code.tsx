import { QRCode } from "react-qrcode-logo";
import { Progress } from "../ui/progress";
import { useCallback, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { useAtom } from "jotai";
import { validUidAtom } from "~/stores/valid-uid";

const QR_UPDATE_DURATION = 10_000; // 5 seconds
const PROGRESS_UPDATE_DURATION = 100; // 100ms

export function QrCode() {
	const [validUid, setValidUid] = useAtom(validUidAtom);
	const [timeLeft, setTimeLeft] = useState(QR_UPDATE_DURATION);
	const progressValue = (timeLeft / QR_UPDATE_DURATION) * 100;
	const qrTimeout = useRef<NodeJS.Timeout>();

	const updateRandomUid = useCallback(() => {
		return setTimeout(() => {
			if (timeLeft <= 0) {
				setValidUid(nanoid());
				setTimeLeft(QR_UPDATE_DURATION);
				qrTimeout.current = updateRandomUid();
			} else {
				setTimeLeft((prev) => prev - PROGRESS_UPDATE_DURATION);
			}
		}, PROGRESS_UPDATE_DURATION);
	}, [setValidUid, timeLeft]);

	return (
		<>
			<div className="w-[500px] h-[500px]">
				<QRCode
					size={480}
					style={{ height: "auto", maxWidth: "100%", width: "100%" }}
					value={validUid}
					logoImage="/wri-logo-small.png"
					removeQrCodeBehindLogo
					logoPadding={8}
					logoWidth={120}
					logoHeight={128}
				/>
			</div>
			<Progress value={progressValue} className="bg-slate-300 h-4" />
		</>
	);
}
