import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid w-full place-items-center justify-center py-4">
      <SignUp fallbackRedirectUrl={"/app"} />
    </div>
  );
}
