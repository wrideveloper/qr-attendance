import type { MetaFunction } from "@remix-run/node";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="h-full flex flex-col gap-4 items-center justify-center">
      <h1 className="text-2xl">wri qr attendance</h1>
      <Button>Click Me</Button>
    </div>
  );
}
