import { zodResolver } from "@hookform/resolvers/zod";
import type { MetaFunction } from "@remix-run/node";
import { Link, useSubmit } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
import { nanoid } from "nanoid";
import { useState } from "react";
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
import { extractToken } from "~/services/token";

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
	const [isSubmitting, setSubmitting] = useState(false);

	async function submitAttendance(qrValue: string) {
		setSubmitting(true);
		const { formId, encryptedString, iv } = extractToken(qrValue);
		const formData = new FormData();
		formData.set("id", nanoid());
		formData.set("fullname", form.getValues("fullname"));
		formData.set("class", form.getValues("class"));
		formData.set("studyProgram", form.getValues("studyProgram"));
		formData.set("feedback", form.getValues("feedback"));
		formData.set("time", new Date().toISOString());
		submit(formData, {
			method: "POST",
			action: `/submit/${formId}/${encryptedString}/${iv}`,
			navigate: true,
		});
	}

	return (
		<div className="h-full flex flex-col gap-4 items-center justify-center">
			<Card className="p-4 md:w-[420px] max:w-[640px]">
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
							name="feedback"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Feedback</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Feedback" />
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
						<ScanQrDialog
							isDisabled={!form.formState.isValid}
							onScanned={submitAttendance}
							isSubmitting={isSubmitting}
						/>
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
