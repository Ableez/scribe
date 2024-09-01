"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  TbHeartFilled,
  TbHome,
  TbLayoutSidebarLeftExpand,
  TbLayoutSidebarRightExpandFilled,
  TbLock,
  TbStack2Filled,
} from "react-icons/tb";
import { IoDocument } from "react-icons/io5";
import { Ellipsis, FileStack, Search, Stars } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const sidebarLists = [
  {
    title: "Scribe AI",
    link: "",
    icon: (
      <Stars
        className="fill-purple-700 stroke-purple-700"
        fill="#777777"
        size={18}
      />
    ),
  },
  { title: "Search", link: "", icon: <Search size={18} /> },
  { title: "Home", link: "", icon: <TbHome size={18} /> },
  { title: "Sticky notes", link: "", icon: <IoDocument size={18} /> },
  { title: "Learn", link: "", icon: <TbStack2Filled size={18} /> },
  { title: "My books", link: "", icon: <FileStack size={18} /> },
];

export const sidebarArrangementGroups = [
  {
    title: "Favorites",
    icon: (
      <TbHeartFilled
        className="text-xl text-neutral-700 dark:text-neutral-500"
        size={14}
      />
    ),
    list: [
      {
        title: "COM113 Notes",
        icon: "🔌",
        link: "",
      },
      {
        title: "Brainstomer",
        icon: "💡",
        link: "",
      },
    ],
  },
  {
    title: "Private",
    icon: (
      <TbLock
        className="text-xl text-neutral-700 dark:text-neutral-500"
        size={14}
      />
    ),
    list: [
      {
        title: "COM113 Notes",
        icon: "🔌",
        link: "",
      },
      {
        title: "Brainstomer",
        icon: "💡",
        link: "",
      },
    ],
  },
];
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen((p) => !p);
  };

  const router = useRouter();

  return (
    <div
      className={`hidden flex-col place-items-start justify-start border-r-transparent bg-violet-100 align-middle transition-all duration-300 ease-in-out hover:border-r-violet-600/30 dark:bg-neutral-900 dark:hover:border-r-violet-700/10 lg:flex ${
        isOpen ? "w-[20vw] px-2 py-4" : "w-[4vw] border-r p-0.5 py-4"
      }`}
    >
      <div className="flex w-full place-items-center justify-between px-2 pb-2 align-middle">
        {!isOpen && (
          <Button
            className="w-full"
            variant={"icon"}
            size={"icon"}
            onClick={toggleSidebar}
          >
            <TbLayoutSidebarLeftExpand size={22} />
          </Button>
        )}
        <h4
          className={`${isOpen ? "block opacity-100" : "hidden opacity-0"} font-mono font-bold transition-all duration-300 ease-in-out`}
        >
          Scribe
        </h4>
        {isOpen && (
          <Button variant={"icon"} size={"icon"} onClick={toggleSidebar}>
            <TbLayoutSidebarRightExpandFilled size={22} />
          </Button>
        )}
      </div>
      <Link href="" className="mb-4 w-full">
        <div
          className={`flex w-full cursor-pointer place-items-center justify-between rounded-2xl border bg-violet-50/50 dark:border-violet-400/5 dark:bg-violet-400/5 ${isOpen ? "px-2" : "px-0"} align-middle transition-all duration-300 ease-in-out hover:bg-violet-300/60`}
        >
          <div className="flex place-items-center justify-between gap-1 align-middle">
            <Avatar className="scale-75">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            {isOpen && (
              <h4 className="text-xs font-semibold">Ahmed Abdullahi</h4>
            )}
          </div>
          {isOpen && (
            <Button
              className="hover:bg-white/50"
              variant={"icon"}
              size={"icon"}
            >
              <Ellipsis size={20} />
            </Button>
          )}
        </div>
      </Link>
      <div className="grid w-full place-items-center">
        {sidebarLists.map(({ title, icon, link }, idx) => (
          <div
            key={idx}
            onClick={() => router.push(link)}
            className={`${isOpen ? "px-4" : "flex w-full place-items-center justify-center px-0"} flex h-8 w-full cursor-pointer place-items-center justify-start gap-4 rounded-sm border border-none border-black bg-transparent align-middle text-sm font-semibold text-neutral-700 shadow-none transition-all duration-200 ease-in-out hover:bg-violet-200 dark:text-neutral-300 dark:hover:bg-violet-500/10`}
          >
            {icon}
            {isOpen && (
              <h4
                className={`${isOpen ? "opacity-100" : "opacity-0"} transition-all duration-200 ease-in-out`}
              >
                {title}
              </h4>
            )}
          </div>
        ))}
      </div>
      <div className={`mt-4 w-full`}>
        {sidebarArrangementGroups.map((list, idx) => {
          return (
            <div key={idx} className={`w-full ${isOpen ? "py-3" : "p-0"}`}>
              <div
                className={`mb-1 flex w-full place-items-center justify-start gap-1 rounded-lg ${isOpen ? "px-4" : "w-full"} py-0.5 align-middle opacity-60`}
              >
                {!isOpen ? (
                  <span className="grid w-full place-items-center justify-center rounded-full p-2 text-xl transition-all duration-300 ease-in-out dark:bg-neutral-900 dark:hover:bg-violet-600/10">
                    {list.icon}
                  </span>
                ) : (
                  <span>{list.icon}</span>
                )}
                {isOpen && (
                  <h4 className="text-xs font-semibold text-neutral-700 dark:text-neutral-500">
                    {list.title}
                  </h4>
                )}
              </div>
              {isOpen && (
                <div>
                  {list.list.map(({ title, icon, link }, idx) => (
                    <Button
                      key={idx}
                      onClick={() => router.push(link)}
                      className="grid h-8 w-full grid-flow-col grid-cols-6 place-items-start items-center justify-center rounded-sm border-none bg-transparent py-0 text-neutral-700 shadow-none hover:bg-violet-200 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-violet-200/10"
                    >
                      <span className="col-span-1">{icon}</span>
                      <h4 className="text-sm font-normal">{title}</h4>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
