"use client";
import React, { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { BellIcon } from "lucide-react";
import { TbBellCog } from "react-icons/tb";
import Link from "next/link";

const DesktopNavbar = () => {
  return (
    <div className="sticky top-0 z-[999] hidden place-items-center justify-between bg-white/60 px-16 pb-2 pt-4 align-middle backdrop-blur-md dark:bg-neutral-900/70 lg:flex">
      <Link href={"/app"}>
        <h4 className="font-mono font-bold">Scribe</h4>
      </Link>
      <div className="flex place-items-center justify-between gap-2 align-middle">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <div>
          <ThemeToggle />
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button title="Notifications" variant="outline" size="icon">
                <BellIcon size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="relative mr-4 max-h-[60dvh] min-h-[20dvh] w-72 overflow-scroll px-2 pb-4">
              <div className="sticky top-0 mb-2 flex place-items-center justify-between bg-white py-2 align-middle text-[12px] font-semibold dark:bg-black dark:text-neutral-500">
                <h4>Notifications</h4>
                <Button
                  title="Notification settings"
                  variant={"icon"}
                  size={"icon"}
                >
                  <TbBellCog />
                </Button>
              </div>
              <div className="grid w-full grid-flow-row gap-1 p-2">
                <div className="h-16 w-full cursor-pointer rounded-xl bg-neutral-200/50 transition-all duration-300 ease-in-out hover:bg-neutral-200/80 dark:bg-neutral-800/40 dark:hover:bg-neutral-700/70" />
                <div className="h-16 w-full cursor-pointer rounded-xl bg-neutral-200/50 transition-all duration-300 ease-in-out hover:bg-neutral-200/80 dark:bg-neutral-800/40 dark:hover:bg-neutral-700/70" />
                <div className="h-16 w-full cursor-pointer rounded-xl bg-neutral-200/50 transition-all duration-300 ease-in-out hover:bg-neutral-200/80 dark:bg-neutral-800/40 dark:hover:bg-neutral-700/70" />
                <div className="h-16 w-full cursor-pointer rounded-xl bg-neutral-200/50 transition-all duration-300 ease-in-out hover:bg-neutral-200/80 dark:bg-neutral-800/40 dark:hover:bg-neutral-700/70" />
                <div className="h-16 w-full cursor-pointer rounded-xl bg-neutral-200/50 transition-all duration-300 ease-in-out hover:bg-neutral-200/80 dark:bg-neutral-800/40 dark:hover:bg-neutral-700/70" />
                <div className="h-16 w-full cursor-pointer rounded-xl bg-neutral-200/50 transition-all duration-300 ease-in-out hover:bg-neutral-200/80 dark:bg-neutral-800/40 dark:hover:bg-neutral-700/70" />
                <div className="h-16 w-full cursor-pointer rounded-xl bg-neutral-200/50 transition-all duration-300 ease-in-out hover:bg-neutral-200/80 dark:bg-neutral-800/40 dark:hover:bg-neutral-700/70" />
                <div className="h-16 w-full cursor-pointer rounded-xl bg-neutral-200/50 transition-all duration-300 ease-in-out hover:bg-neutral-200/80 dark:bg-neutral-800/40 dark:hover:bg-neutral-700/70" />
                <div className="h-16 w-full cursor-pointer rounded-xl bg-neutral-200/50 transition-all duration-300 ease-in-out hover:bg-neutral-200/80 dark:bg-neutral-800/40 dark:hover:bg-neutral-700/70" />
                <div className="h-16 w-full cursor-pointer rounded-xl bg-neutral-200/50 transition-all duration-300 ease-in-out hover:bg-neutral-200/80 dark:bg-neutral-800/40 dark:hover:bg-neutral-700/70" />
                <div className="h-16 w-full cursor-pointer rounded-xl bg-neutral-200/50 transition-all duration-300 ease-in-out hover:bg-neutral-200/80 dark:bg-neutral-800/40 dark:hover:bg-neutral-700/70" />
                <div className="h-16 w-full cursor-pointer rounded-xl bg-neutral-200/50 transition-all duration-300 ease-in-out hover:bg-neutral-200/80 dark:bg-neutral-800/40 dark:hover:bg-neutral-700/70" />
                <div className="h-16 w-full cursor-pointer rounded-xl bg-neutral-200/50 transition-all duration-300 ease-in-out hover:bg-neutral-200/80 dark:bg-neutral-800/40 dark:hover:bg-neutral-700/70" />
                <div className="h-16 w-full cursor-pointer rounded-xl bg-neutral-200/50 transition-all duration-300 ease-in-out hover:bg-neutral-200/80 dark:bg-neutral-800/40 dark:hover:bg-neutral-700/70" />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );

  return null;
};

export default DesktopNavbar;
