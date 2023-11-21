import { QrCodeIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { exportFormResultToCsv } from "~/services/exporter";
import { downloadStringAsFile } from "~/services/download";
import { Link } from "@remix-run/react";
import { useAtom } from "jotai";
import { attendanceAtom, attendanceFormAtom } from "~/stores/attendance";
import type { AttendanceForm } from "~/schema/attendance";

type FormCardProps = {
	id: string;
	miniclass: string;
	miniclassType: string;
	mentors: string[];
	date: Date;
};

export function FormCard(props: FormCardProps) {
	const [, setAttendanceForms] = useAtom(attendanceFormAtom);
	const [attendances, setAttendances] = useAtom(attendanceAtom);

	async function handleExport() {
		console.log("Exporting to CSV");
		const csv = await exportFormResultToCsv(attendances[props.id]);
		downloadStringAsFile(
			csv,
			`exported-${props.id}-${new Date(props.date).toLocaleDateString("id-ID", {
				day: "numeric",
				month: "numeric",
				year: "numeric",
			})}.csv`,
			`text/csv`
		);
	}

	async function handleRemove() {
		console.log("Removing");
		setAttendanceForms((forms: Record<string, AttendanceForm>) => {
			const newForms = { ...forms };
			delete newForms[props.id];
			return newForms;
		});
		setAttendances((prev: Record<string, AttendanceForm>) => {
			const newAttendances = { ...prev };
			delete newAttendances[props.id];
			return newAttendances;
		});
	}

	return (
		<Card className="flex flex-col gap-2 p-4">
			<Link to={`/attendance/${props.id}`}>
				<div className="flex gap-2 items-center justify-between">
					<div className="flex items-center justify-center">
						<QrCodeIcon className="text-slate-800 w-16 h-16" />
					</div>
					<div className="flex flex-col flex-1">
						<span className="text-slate-800 font-semibold text-lg">
							{props.miniclass} - {props.miniclassType}
						</span>
						<span className="text-sm text-slate-600">
							{props.mentors.map((mentor) => mentor).join(", ")}
						</span>
					</div>
					<div className="flex flex-col items-end">
						<span className="text-sm text-slate-600">
							{new Date(props.date).toLocaleDateString("id-ID", {
								weekday: "long",
							})}
							,
						</span>
						<span className="text-sm text-slate-600">
							{new Date(props.date).toLocaleDateString("id-ID", {
								day: "numeric",
								month: "long",
								year: "numeric",
							})}
						</span>
					</div>
				</div>
			</Link>
			<div className="flex justify-end items-center gap-2">
				<Button size="sm" className="bg-teal-600 hover:bg-teal-500" onClick={handleExport}>
					Export to CSV
				</Button>
				<Button size="sm" variant="destructive" onClick={handleRemove}>
					Remove
				</Button>
			</div>
		</Card>
	);
}
