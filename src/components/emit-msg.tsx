"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { api } from "@/trpc/react";

const EmitMsg = () => {
  const [resp, setResp] = useState<{
    message: string;
    data: {
      name: string;
    };
  }>();
  const onClick = api.wsTest.add.useMutation();

  const pingServer = async () => {
    const data = await onClick.mutateAsync({ name: "Ableez" });

    console.log(data);
    setResp(data);
  };

  return (
    <div className="flex flex-col place-items-center justify-center gap-4">
      <h4 className="my-4 text-sm font-semibold">
        RESPONSE: {resp?.data.name}
      </h4>
      <Button onClick={pingServer}>Emit</Button>
    </div>
  );
};

export default EmitMsg;
