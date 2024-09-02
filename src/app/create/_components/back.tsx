"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";
import { IoChevronBack } from "react-icons/io5";

const BackButton = () => {
  const router = useRouter();

  return (
    <div className="sticky top-0 mx-auto w-full bg-white px-4 py-2 dark:bg-neutral-900">
      <div className="mx-auto max-w-screen-md"></div>
    </div>
  );
};

export default BackButton;
