"use client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import MobileSidebarContent from "./mobile-sidebar-content";
import { ThemeToggle } from "./theme-toggle";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { BellIcon, Ellipsis, MoonIcon, SunIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "next-themes";

const MobileNavbar = () => {
  const { setTheme, theme } = useTheme();

  return (
    <div className="sticky top-0 z-[49] bg-white/80 align-middle backdrop-blur-md dark:bg-neutral-900/80 px-2 lg:hidden">
      <div className="relative flex place-items-center justify-between py-2 align-middle lg:hidden">
        <MobileSidebarContent />

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <h4 className="font-mono text-lg font-semibold">Scribe</h4>
        </div>

        <Drawer>
          <DrawerTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <Ellipsis size={18} />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="w-full">
            <div className="flex h-[50dvw] w-full flex-col place-items-start justify-start gap-4 px-4 py-4 align-top transition-all duration-300 ease-in-out">
              <DropdownMenu modal={true}>
                <DropdownMenuTrigger className="w-full">
                  <Button
                    className={
                      "flex w-full justify-start gap-4 border-none bg-transparent text-black shadow-none hover:bg-violet-200/60 dark:bg-transparent dark:text-white dark:hover:bg-violet-500/20"
                    }
                  >
                    <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 text-violet-800 transition-all dark:-rotate-90 dark:scale-0 dark:text-violet-300" />
                    <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 text-violet-800 transition-all dark:rotate-0 dark:scale-100 dark:text-violet-300" />
                    <span className="capitalize">{theme} theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-[80dvw]">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                className={
                  "flex w-full justify-start gap-4 border-none bg-transparent text-black shadow-none hover:bg-violet-200/60 dark:bg-transparent dark:text-white dark:hover:bg-violet-500/20"
                }
              >
                <BellIcon
                  size={18}
                  className="text-violet-800 dark:text-violet-300"
                />
                <span>Notifications</span>
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );

  return null;
};

export default MobileNavbar;
