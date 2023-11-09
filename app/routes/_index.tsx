import type { MetaFunction } from "@remix-run/node";
import { Link, useNavigate } from "@remix-run/react";
import { QrCodeIcon } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { CreateAttendanceFormDialog } from "~/components/attendance/create-attendance-dialog";
import { FormCard } from "~/components/attendance/form-card";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import type { AttendanceForm } from "~/schema/attendance";
import { createAttendanceForm, getAllAttendanceForms } from "~/services/attendance";

export const meta: MetaFunction = () => {
	return [{ title: "WRI QR Attendance" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
	const [attendanceForms, setAttendanceForms] = useState<AttendanceForm[]>([]);
	const navigate = useNavigate();

	useLayoutEffect(() => {
		(async () => {
			const storedForms = await getAllAttendanceForms();
			setAttendanceForms(storedForms);
		})();
	}, []);

	return (
		<div className="flex flex-col md:flex-row gap-28 items-center h-full max-w-screen-xl mx-auto px-8">
			<div className="flex-1 h-full flex flex-col gap-8 items-end justify-center">
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
							createAttendanceForm({
								...detail,
								mentors: detail.mentors.filter((mentor) => mentor !== ""),
							});
							navigate(`/attendance/${detail.id}`);
						}}
					/>
				</div>
			</div>
			{attendanceForms.length > 0 && (
				<div className="flex-1">
					<h1 className="text-2xl font-semibold text-slate-800">List of Attendance Forms</h1>
					<p className="text-sm text-slate-600">These are past attendance forms on your device</p>
					<Separator className="my-4" />
					<ScrollArea className="h-[500px]">
						<div className="flex flex-col gap-4 pr-4">
							{attendanceForms.map((form) => (
								<Link key={form.id} to={`/attendance/${form.id}`} className="w-full">
									<FormCard {...form} />
								</Link>
							))}
						</div>
					</ScrollArea>
				</div>
			)}
		</div>
	);
}
