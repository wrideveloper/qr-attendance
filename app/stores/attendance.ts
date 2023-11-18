import type { Attendance, AttendanceForm } from "~/schema/attendance";
import { atomWithLocalStorage } from "./utils";
 
export const attendanceAtom = atomWithLocalStorage<Record<string, Attendance[]>>("attendance", {});

export const attendanceFormAtom = atomWithLocalStorage<Record<string, AttendanceForm>>("attendance-form", {});
