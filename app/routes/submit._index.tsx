import { zodResolver } from "@hookform/resolvers/zod";
import type { MetaFunction } from "@remix-run/cloudflare";
import { Link, useSubmit } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import { ScanQrDialog } from "~/components/attendance/scan-qr-dialog";
import { Combobox } from "~/components/form/combobox";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { studyProgram as studyPrograms, universityClass as universityClasses } from "~/data/class";
import { capitalise } from "~/lib/utils";
import { type Attendance, attendanceSchema } from "~/schema/attendance";

export const meta: MetaFunction = () => {
	return [{ title: "Submit Attendance | Workshop Riset Informatik" }];
};

export default function ScanPage() {
	const form = useForm<Attendance>({
		defaultValues: {
			id: nanoid(),
			fullname: "",
			time: new Date(),
		},
		resolver: zodResolver(attendanceSchema),
	});
	const submit = useSubmit();

	async function submitAttendance(qrValue: string) {
		const [formId, randomUid] = qrValue.split("::");
		const formData = new FormData();
		formData.set("id", formId);
		formData.set("fullname", form.getValues("fullname"));
		formData.set("class", form.getValues("class"));
		formData.set("studyProgram", form.getValues("studyProgram"));
		formData.set("time", new Date().toISOString());
		submit(formData, {
			method: "POST",
			action: `/submit/${formId}/${randomUid}`,
			navigate: true,
		});
	}

	return (
		<div className="h-full flex flex-col gap-4 items-center justify-center">
			<Card className="p-4">
				<Form {...form}>
					<form className="space-y-6 pb-4">
						<FormField
							control={form.control}
							name="fullname"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Fullname</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Fullname" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="class"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Class</FormLabel>
									<FormControl>
										<Combobox
											items={universityClasses as unknown as string[]}
											placeholder="Select your class"
											emptyText="No Class Found"
											onChange={(value) => field.onChange(value.toUpperCase())}
											side="bottom"
											valueTextTransform="uppercase"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="studyProgram"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Study Program</FormLabel>
									<FormControl>
										<Combobox
											items={studyPrograms as unknown as string[]}
											placeholder="Select your study program"
											emptyText="No study program Found"
											onChange={(value) => field.onChange(capitalise(value))}
											side="bottom"
											valueTextTransform="capitalize"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<ScanQrDialog isDisabled={!form.formState.isValid} onScanned={submitAttendance} />
					</form>
				</Form>
				<Link to="/">
					<Button className="flex gap-2 w-full" variant="outline">
						<ArrowLeft className="w-4 h-4" />
						Back
					</Button>
				</Link>
			</Card>
		</div>
	);
}
