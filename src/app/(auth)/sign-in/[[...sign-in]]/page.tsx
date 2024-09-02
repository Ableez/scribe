import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid w-full pt-4 place-items-center justify-center">
      <SignIn fallbackRedirectUrl={"/app"} />
    </div>
  );
}
