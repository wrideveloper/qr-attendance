import { z } from "zod";
import { studyProgram, universityClass } from "~/data/class";
import { miniclass, miniclassType } from "~/data/miniclass";

export const attendanceFormSchema = z.object({
	id: z.string().uuid(),
	date: z.date(),
	miniclass: z.enum(miniclass),
	miniclassType: z.enum(miniclassType),
	mentors: z.array(z.string()),
});
export type AttendanceForm = z.infer<typeof attendanceFormSchema>;

export const attendanceSchema = z.object({
	id: z.string().uuid(),
	fullname: z.string(),
	class: z.enum(universityClass),
	studyProgram: z.enum(studyProgram),
	feedback: z.string().default(""),
});
export type Attendance = z.infer<typeof attendanceSchema>;
