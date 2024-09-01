import React from "react";
import { History } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { parseTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { recentNotes } from "data/recent_notes";

const RecentNotes = () => {
  return (
    <div className="my-4 w-full lg:w-[70vw]">
      <div className="py-4">
        <h4 className="justify flex place-items-center gap-2 px-4 align-middle text-base text-neutral-500 lg:text-xs lg:font-semibold">
          <History size={16} className="hidden lg:block" /> Jump back in
        </h4>
      </div>
      <Carousel
        opts={{
          align: "start",
        }}
        className="group mx-auto max-w-[96dvw] rounded-xl bg-violet-100/70 py-4 dark:bg-neutral-900 lg:w-[100%]"
      >
        <CarouselContent>
          {recentNotes.map((note, index) => (
            <CarouselItem
              className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
              key={index}
            >
              <div className="pb-2 pl-2 pr-1">
                <div className="rounded-2xl border border-transparent bg-white shadow-md shadow-violet-200/60 transition-all duration-300 ease-in hover:border-neutral-200 dark:bg-neutral-800/60 dark:shadow-violet-900/5 dark:hover:border-neutral-700 lg:h-[160px] lg:w-[170px]">
                  <div
                    className={`relative h-1/4 w-full rounded-t-2xl p-4 dark:bg-violet-300/20`}
                    style={{
                      backgroundColor: note.theme,
                    }}
                  >
                    <span className="absolute -bottom-3 left-0 px-2 text-xl">
                      {/* <CgFileDocument size={28} /> */}
                      {note.icon}
                    </span>
                  </div>

                  <div className="grid h-3/4 grid-flow-row grid-rows-4 p-2">
                    <div className="row-span-3 pt-4">
                      <h4 className="text-sm font-medium">{note.note_title}</h4>
                    </div>
                    <div className="row-span-1 flex w-full place-items-center justify-start gap-2 align-middle">
                      <Button
                        className="mr-2 h-6 w-6 bg-neutral-200 text-[10px] uppercase dark:bg-neutral-700"
                        variant={"icon"}
                        size={"icon"}
                      >
                        <AnimatedTooltip
                          item={{
                            id: note.last_edited.editedby.id,
                            name: note.last_edited.editedby.username,
                            designation: parseTime(
                              note.last_edited.updated_at,
                              { showTime: true },
                            ),
                            image: note.last_edited.editedby.image,
                          }}
                        />
                        {note.last_edited.editedby.username.charAt(0)}
                      </Button>
                      <h6 className="text-xs">
                        {parseTime(note.last_edited.updated_at)}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden place-items-center justify-center opacity-0 group-hover:grid group-hover:opacity-100" />
        <CarouselNext className="hidden place-items-center justify-center opacity-0 group-hover:grid group-hover:opacity-100" />
      </Carousel>
    </div>
  );
};

export default RecentNotes;
