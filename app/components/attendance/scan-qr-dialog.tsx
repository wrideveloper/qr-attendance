import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ArrowRight } from "lucide-react";
import { QrScanner } from "@yudiel/react-qr-scanner";

type ScanQrDialogProps = {
	isDisabled?: boolean;
	onScanned: (qrValue: string) => void;
};

export function ScanQrDialog(props: ScanQrDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					className="w-full flex gap-2"
					size="lg"
					disabled={props.isDisabled}
					type="button"
				>
					<ArrowRight />
					Continue
				</Button>
			</DialogTrigger>
			<DialogContent className="!w-96">
				<DialogHeader>
					<DialogTitle>Attendance Details</DialogTitle>
				</DialogHeader>
				<Separator />
				<div className="w-80 h-80 rounded-md overflow-hidden mx-auto">
					<QrScanner
						containerStyle={{ width: "100%", height: "100%" }}
						onDecode={props.onScanned}
						onError={(error) => console.error({ error, message: error.message })}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
