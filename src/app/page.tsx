import { Button } from "@/components/ui/button";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";

const Home = async () => {
  const { userId } = auth();
  const user = await currentUser();

  return (
    <div className="grid h-screen w-screen place-items-center justify-center align-middle">
      <div className="grid place-items-center justify-center">
        <h4 className="text-2xl font-bold">
          Welcome{" "}
          {!userId ? (
            "to Scribe"
          ) : (
            <span className="capitalize">back {user?.username ?? "User"}</span>
          )}
        </h4>
        <p className="mb-4">Your school companion app</p>
        {!userId ? (
          <div className="grid w-full gap-2 p-4">
            <Link className="w-full" href={"/sign-in"}>
              <Button className="w-full">Sign In</Button>
            </Link>
            <Link className="w-full" href={"/sign-up"}>
              <Button variant={"outline"} className="w-full">
                Sign Up
              </Button>
            </Link>
          </div>
        ) : (
          <div>
            <Link className="w-full" href={"/app"}>
              <Button className="w-full">Continue to app</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
