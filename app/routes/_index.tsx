import type { MetaFunction } from "@remix-run/cloudflare";
import { Link, useNavigate } from "@remix-run/react";
import { useAtom } from "jotai";
import { ListChecksIcon } from "lucide-react";
import { ClientOnly } from "remix-utils/client-only";
import { CreateAttendanceFormDialog } from "~/components/attendance/create-attendance-form-dialog";
import { FormCard } from "~/components/attendance/form-card";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import type { AttendanceForm } from "~/schema/attendance";
import { attendanceAtom, attendanceFormAtom } from "~/stores/attendance";

export const meta: MetaFunction = () => {
	return [{ title: "WRI QR Attendance" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
	const [attendanceForms, setAttendanceForms] = useAtom(attendanceFormAtom);
	const [, setAttendances] = useAtom(attendanceAtom);
	const attendanceFormsValues = Object.values(attendanceForms);
	const navigate = useNavigate();

	function handleCreateAttendanceForm(detail: AttendanceForm) {
		setAttendanceForms((forms: Record<string, AttendanceForm>) => ({
			...forms,
			[detail.id]: detail,
		}));
		setAttendances((prev: Record<string, AttendanceForm>) => ({
			...prev,
			[detail.id]: [],
		}));
		navigate(`/attendance/${detail.id}`);
	}

	return (
		<div className="flex flex-col md:flex-row gap-28 items-center h-full max-w-screen-xl mx-auto px-8">
			<div className="flex-1 h-full flex flex-col gap-8 items-center justify-center">
				<img src="/wri-logo.png" alt="WRI Logo" className="w-72" />
				<div className="flex flex-col gap-2 w-72">
					<Link to="/submit" className="w-full">
						<Button className="w-full flex gap-2" size="lg">
							<ListChecksIcon />
							Submit Attendance
						</Button>
					</Link>
					<CreateAttendanceFormDialog onCreate={handleCreateAttendanceForm} />
				</div>
			</div>
			<ClientOnly>
				{() =>
					attendanceFormsValues.length > 0 && (
						<div className="flex-1">
							<h1 className="text-2xl font-semibold text-slate-800">List of Attendance Forms</h1>
							<p className="text-sm text-slate-600">These are past attendance forms on your device</p>
							<Separator className="my-4" />
							<ScrollArea className="h-[500px]">
								<div className="flex flex-col gap-4 pr-4">
									{attendanceFormsValues.map((form) => (
										<FormCard key={form.id} {...form} />
									))}
								</div>
							</ScrollArea>
						</div>
					)
				}
			</ClientOnly>
		</div>
	);
}
