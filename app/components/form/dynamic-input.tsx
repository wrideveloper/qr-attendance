import { useState } from "react";
import { Button } from "../ui/button";
import { PlusIcon, XIcon } from "lucide-react";
import { Combobox } from "./combobox";
import { mentors } from "~/data/mentors";
import { capitalise } from "~/lib/utils";

type DynamicInputProps = {
	values: string[];
	onChange: (values: string[]) => void;
};

export function DynamicInput(props: DynamicInputProps) {
	// always keep a single empty input
	const [values, setValues] = useState(props.values.length < 1 ? [""] : props.values);

	const add = () => {
		const newValues = [...values, ""];
		setValues(newValues);
		props.onChange(newValues);
	};

	const remove = (index: number) => {
		// prevent removing the last input
		if (values.length === 1) return;
		const newValues = values.filter((_, i) => i !== index);
		setValues(newValues);
		props.onChange(newValues);
	};

	const onChange = (newValue: string, index: number) => {
		const newValues = values.map((oldValue, i) => (i === index ? newValue : oldValue));
		setValues(newValues);
		props.onChange(newValues);
	};

	return (
		<div className="flex flex-col gap-2">
			{values.map((mentor, index) => (
				<div key={index} className="flex gap-2">
					<Combobox
						items={mentors}
						placeholder="Select Mentor"
						emptyText="No Mentor Found"
						onChange={(value) => onChange(capitalise(value), index)}
						defaultValue={mentor}
					/>
					<Button
						variant="destructive"
						size="icon"
						className="px-2"
						role="button"
						onClick={() => remove(index)}
					>
						<XIcon className="h-5 w-5" />
					</Button>
				</div>
			))}
			<Button variant="secondary" onClick={add}>
				<PlusIcon className="text-slate-600" />
			</Button>
		</div>
	);
}
