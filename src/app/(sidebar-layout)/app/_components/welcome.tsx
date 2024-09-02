import { useUser } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import React from "react";

type Props = {};

const WelcomeComp = async (props: Props) => {
  const { userId } = auth();

  if (!userId) {
    return <div>Please sign in to view this page.</div>;
  }

  const user = await currentUser();

  return (
    <div>
      <h4 className="text-2xl capitalize lg:text-lg font-semibold">
        👋🏽 Welcome {`${user?.username}`}
      </h4>
    </div>
  );
};

export default WelcomeComp;
