import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { QrCodeIcon } from "lucide-react";
import { CreateAttendanceFormDialog } from "~/components/attendance/create-attendance-dialog";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
	return [{ title: "WRI QR Attendance" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
	return (
		<div className="h-full flex flex-col gap-8 items-center justify-center">
			<img src="/wri-logo.png" alt="WRI Logo" className="w-72" />
			<div className="flex flex-col gap-2 w-72">
				<Link to="/scan" className="w-full">
					<Button className="w-full flex gap-2" size="lg">
						<QrCodeIcon />
						Scan QR Code
					</Button>
				</Link>
				<CreateAttendanceFormDialog
					onCreate={(detail) => {
						console.log({ detail });
					}}
				/>
			</div>
		</div>
	);
}
