import { Card } from "../ui/card";

type AttendanceCardProps = {
	name: string;
	class: string;
	studyProgram: string;
	time: Date;
};

export function AttendanceCard(props: AttendanceCardProps) {
	return (
		<Card className="flex items-center justify-between p-4">
			<div className="flex flex-col">
				<span className="text-lg font-semibold text-slate-800">{props.name}</span>
				<span className="text-sm text-slate-800">
					{props.class} - {props.studyProgram}
				</span>
			</div>
			<span className="text-sm font-semibold text-slate-700">
				{new Date(props.time).toLocaleTimeString("id-ID", {
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
				})}
			</span>
		</Card>
	);
}
