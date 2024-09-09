import { auth, currentUser } from "@clerk/nextjs/server";
import React from "react";

const WelcomeComp = async () => {
  const { userId } = auth();

  if (!userId) {
    return <div>Please sign in to view this page.</div>;
  }

  const user = await currentUser();

  if (!user) {
    return (
      <div className="grid h-screen w-screen place-items-center justify-center align-middle">
        <h4 className="text-3xl font-semibold">❌Something seems wrong!</h4>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-2xl font-semibold capitalize lg:text-lg">
        👋🏽 Welcome {`${user?.username}`}
      </h4>
    </div>
  );
};

export default WelcomeComp;
