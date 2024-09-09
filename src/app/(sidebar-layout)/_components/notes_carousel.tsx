"use client";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useNotesData } from "@/lib/store/notecontent";
import type { EditorSettings } from "@/lib/store/types";
import { useRouter } from "next/navigation";
import React from "react";
import { formatDistanceToNow } from "date-fns";

const NotesCarousel = () => {
  const { notes } = useNotesData();
  const router = useRouter();
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="group mx-auto max-w-[96dvw] rounded-xl bg-violet-100/70 py-4 dark:bg-neutral-900 lg:w-[100%]"
    >
      <CarouselContent>
        {!notes ? (
          <div className="h-24 text-neutral-600">
            <h4>Your recent notes will show up here</h4>
          </div>
        ) : (
          notes.slice(0, 5).map((note, index) => {
            const editorSettings =
              typeof note.editorSettings === "string"
                ? (JSON.parse(note.editorSettings) as EditorSettings)
                : null;

            return (
              <CarouselItem
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                key={index}
                onClick={() => router.push(`/note/${note.id}`)}
              >
                <div className="pb-2 pl-2 pr-1">
                  <div className="rounded-2xl border border-transparent bg-white shadow-md shadow-violet-200/60 transition-all duration-300 ease-in hover:border-neutral-200 dark:bg-neutral-800/60 dark:shadow-violet-900/5 dark:hover:border-neutral-700 lg:h-[160px] lg:w-[170px]">
                    <div
                      className={`relative h-1/4 w-full rounded-t-2xl p-4 dark:bg-violet-300/20`}
                      style={{
                        backgroundColor:
                          editorSettings?.theme.backgroundColor ??
                          "rgba(255, 15, 0, 0.09)",
                      }}
                    >
                      <span className="absolute -bottom-3 left-0 px-2 text-xl">
                        {editorSettings?.theme.icon ?? "🗑️"}
                      </span>
                    </div>

                    <div className="grid h-3/4 grid-flow-row grid-rows-4 p-2">
                      <div className="row-span-3 pt-4">
                        <h4 className="text-sm font-medium">{note.title}</h4>
                      </div>
                      <div className="row-span-1 flex w-full place-items-center justify-start gap-2 align-middle">
                        <Button
                          className="mr-2 h-6 w-6 bg-neutral-200 text-[10px] uppercase dark:bg-neutral-700"
                          variant={"icon"}
                          size={"icon"}
                        >
                          {note.lastEdittedBy && (
                            <AnimatedTooltip
                              item={{
                                id: note.lastEdittedBy.id,
                                name: note.lastEdittedBy.username,
                                designation: formatDistanceToNow(
                                  note.updatedAt,
                                ),
                                image: note.lastEdittedBy.image,
                              }}
                            />
                          )}
                          {note.lastEdittedBy?.username.charAt(0)}
                        </Button>
                        <h6 className="text-xs">
                          {formatDistanceToNow(note.updatedAt)}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })
        )}
      </CarouselContent>
      {notes && (
        <CarouselPrevious className="hidden place-items-center justify-center opacity-0 group-hover:grid group-hover:opacity-100" />
      )}
      {notes && (
        <CarouselNext className="hidden place-items-center justify-center opacity-0 group-hover:grid group-hover:opacity-100" />
      )}
    </Carousel>
  );
};

export default NotesCarousel;
