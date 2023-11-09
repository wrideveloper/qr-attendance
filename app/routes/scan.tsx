import { Link } from "@remix-run/react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function ScanPage() {
	return (
		<div className="flex flex-col gap-4">
			<div className="w-64 h-64 rounded-md overflow-hidden">
				<QrScanner
					containerStyle={{ width: "100%", height: "100%" }}
					onDecode={(result) => console.log({ result })}
					onError={(error) => console.error({ error, message: error.message })}
				/>
			</div>
			<Link to="/">
				<Button className="flex gap-2 w-full">
					<ArrowLeft />
					Back
				</Button>
			</Link>
		</div>
	);
}
