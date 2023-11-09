import { useState } from "react";
import { Check, ChevronsUpDownIcon } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "~/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

type ComboboxProps = {
	items: string[];
	placeholder: string;
	defaultValue?: string;
	emptyText: string;
	onChange: (items: string) => void;
};

export function Combobox(props: ComboboxProps) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(props.defaultValue ?? "");

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="justify-between w-full capitalize font-normal"
				>
					{value ? value : props.placeholder}
					<ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-0" side="right">
				<Command>
					<CommandInput placeholder={props.placeholder} />
					<CommandEmpty>{props.emptyText}</CommandEmpty>
					<ScrollArea className="h-60">
						<CommandGroup>
							{props.items.map((item) => (
								<CommandItem
									key={item}
									value={item}
									onSelect={(currentValue) => {
										setValue(currentValue === value ? "" : currentValue);
										setOpen(false);
										props.onChange(currentValue);
									}}
								>
									<Check
										className={cn("mr-2 h-4 w-4", value === item ? "opacity-100" : "opacity-0")}
									/>
									{item}
								</CommandItem>
							))}
						</CommandGroup>
					</ScrollArea>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
