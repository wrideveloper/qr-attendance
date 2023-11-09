import { useForm } from "react-hook-form";
import { nanoid } from "nanoid";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import type { AttendanceForm } from "~/schema/attendance";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { miniclass, miniclassType } from "~/data/miniclass";
import { DynamicInput } from "../form/dynamic-input";

type CreateAttendanceFormDialogProps = {
	onCreate: (detail: AttendanceForm) => void;
};

export function CreateAttendanceFormDialog(props: CreateAttendanceFormDialogProps) {
	const form = useForm<AttendanceForm>({
		defaultValues: {
			id: nanoid(),
			date: new Date(),
			mentors: [],
		},
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Create New Attendance</Button>
			</DialogTrigger>
			<DialogContent className="!w-96">
				<DialogHeader>
					<DialogTitle>Attendance Details</DialogTitle>
				</DialogHeader>
				<Separator />
				<Form {...form}>
					<form onSubmit={form.handleSubmit(props.onCreate)} className="space-y-6">
						<FormField
							control={form.control}
							name="miniclass"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Miniclass</FormLabel>
									<FormControl>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger>
												<SelectValue placeholder="Select miniclass" />
											</SelectTrigger>
											<SelectContent>
												{miniclass.map((miniclass) => (
													<SelectItem key={miniclass} value={miniclass}>
														{miniclass}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="miniclassType"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Miniclass Type</FormLabel>
									<FormControl>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger>
												<SelectValue placeholder="Select miniclass type" />
											</SelectTrigger>
											<SelectContent>
												{miniclassType.map((type) => (
													<SelectItem key={type} value={type}>
														{type}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="mentors"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mentors</FormLabel>
									<FormControl>
										<DynamicInput values={field.value} onChange={field.onChange} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Date</FormLabel>
									<FormControl>
										<Input
											readOnly
											value={field.value.toLocaleString("id-ID", {
												weekday: "long",
												day: "numeric",
												month: "long",
												year: "numeric",
											})}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button className="w-full">Create</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
