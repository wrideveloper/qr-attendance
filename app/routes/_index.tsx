import type { MetaFunction } from "@remix-run/node";
import { Link, useNavigate } from "@remix-run/react";
import { QrCodeIcon } from "lucide-react";
import { CreateAttendanceFormDialog } from "~/components/attendance/create-attendance-dialog";
import { Button } from "~/components/ui/button";
import { createAttendanceForm } from "~/services/attendance";

export const meta: MetaFunction = () => {
	return [{ title: "WRI QR Attendance" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
	const navigate = useNavigate();
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
						createAttendanceForm(detail);
						navigate(`/attendance/${detail.id}`);
					}}
				/>
			</div>
		</div>
	);
}
