import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid min-h-screen w-full place-items-center justify-center py-4">
      <SignUp fallbackRedirectUrl={"/app"} />
    </div>
  );
}
