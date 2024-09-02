import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { sidebarArrangementGroups, sidebarLists } from "./sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ArrowRight, Ellipsis } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";
import { IoMenu } from "react-icons/io5";
import { UserButton } from "@clerk/nextjs";

const MobileSidebarContent = () => {
  const router = useRouter();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="gap-1 border-violet-600 bg-violet-500 px-2 text-white hover:bg-violet-500/80 dark:bg-violet-500 dark:text-white dark:hover:bg-violet-500/70">
          <IoMenu size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="h-[100dvh] w-[320px] overflow-scroll p-2 py-6 sm:w-[28dvw]"
        side={"left"}
      >
        <div>
          <Link href="/user-profile" className="w-full bg-white dark:bg-neutral-900">
            <SheetClose className="sticky top-0 z-[40] w-full dark:shadow-xl">
              <div
                className={`flex w-full cursor-pointer place-items-center justify-between rounded-2xl bg-violet-200/70 px-2 py-2 align-middle transition-all duration-300 ease-in-out hover:bg-violet-300/60 dark:bg-neutral-900`}
              >
                <div className="flex place-items-center justify-between gap-1 align-middle">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <h4 className="text-xs font-semibold">Ahmed Abdullahi</h4>
                </div>
                {/* <Button
                  className="hover:bg-white/50"
                  variant={"icon"}
                  size={"icon"}
                >
                  <Ellipsis size={20} />
                </Button> */}
              </div>
            </SheetClose>
          </Link>

          <div className="grid w-full place-items-center pt-4">
            {sidebarLists.map(({ title, icon, link }, idx) => (
              <SheetClose className="w-full" key={idx}>
                <div
                  onClick={() => router.push(link)}
                  className={`relative flex h-12 w-full cursor-pointer place-items-center justify-start gap-4 rounded-sm border border-none border-black bg-transparent px-4 align-middle text-sm font-semibold text-neutral-700 shadow-none transition-all duration-200 ease-in-out hover:bg-violet-200 hover:pl-6 dark:text-neutral-300 dark:hover:bg-violet-500/10`}
                >
                  {icon}
                  <h4
                    className={`opacity-100 transition-all duration-200 ease-in-out`}
                  >
                    {title}
                  </h4>
                  <ArrowRight
                    size={16}
                    className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 ease-in-out group-hover:right-4 group-hover:opacity-100"
                  />
                </div>
              </SheetClose>
            ))}
          </div>
          <div className={`mt-4 w-full`}>
            {sidebarArrangementGroups.map((list, idx) => {
              return (
                <div key={idx} className={`w-full py-3`}>
                  <div
                    className={`mb-1 flex w-full place-items-center justify-start gap-1 rounded-lg px-2 py-0.5 align-middle opacity-60`}
                  >
                    <span className="grid w-fit place-items-center justify-center rounded-full p-2 text-xl transition-all duration-300 ease-in-out dark:bg-neutral-900 dark:hover:bg-violet-600/10">
                      {list.icon}
                    </span>
                    <h4 className="text-xs font-semibold text-neutral-700 dark:text-neutral-500">
                      {list.title}
                    </h4>
                  </div>
                  <div>
                    {list.list.map(({ title, icon, link }, idx) => (
                      <Button
                        key={idx}
                        onClick={() => router.push(link)}
                        className="grid h-12 w-full grid-flow-col grid-cols-6 place-items-start items-center justify-center rounded-sm border-none bg-transparent py-0 text-neutral-700 shadow-none hover:bg-violet-200 dark:bg-transparent dark:text-neutral-300 dark:hover:bg-violet-200/10"
                      >
                        <span className="col-span-1">{icon}</span>
                        <h4 className="text-sm font-normal">{title}</h4>
                      </Button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebarContent;
