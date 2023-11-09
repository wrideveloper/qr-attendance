import { QrCodeIcon } from "lucide-react";
import { Card } from "../ui/card";

type FormCardProps = {
	miniclass: string;
	miniclassType: string;
	mentors: string[];
	date: Date;
}

export function FormCard(props: FormCardProps) {
	return (
		<Card className="flex gap-2 p-4 items-center">
			<div className="items-center justify-center">
				<QrCodeIcon className="text-slate-800 w-16 h-16" />
			</div>
			<div className="flex flex-col flex-1">
				<span className="text-slate-800 font-semibold text-lg">
					{props.miniclass} - {props.miniclassType}
				</span>
				<span className="text-sm text-slate-600">{props.mentors.map((mentor) => mentor).join(", ")}</span>
			</div>
			<div className="flex flex-col items-end">
				<span className="text-sm text-slate-600">
					{props.date.toLocaleDateString("id-ID", {
						weekday: "long",
					})}
					,
				</span>
				<span className="text-sm text-slate-600">
					{props.date.toLocaleDateString("id-ID", {
						day: "numeric",
						month: "long",
						year: "numeric",
					})}
				</span>
			</div>
		</Card>
	);
}
