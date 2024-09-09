import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotesData } from "@/lib/store/notecontent";
import { useUser } from "@clerk/nextjs";
import { Loader, PlusIcon, SquareCheckBig } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { IoDocument } from "react-icons/io5";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

const FAB = () => {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();

  const { addNote } = useNotesData();

  const query = api.note.getUserNotes.useQuery();

  console.log("getUserPosts", query.data);

  const router = useRouter();

  if (!user) return null;

  const createNote = async () => {
    const { dismiss } = toast({
      description: (
        <div className="flex place-items-center justify-start gap-2 align-middle">
          <Loader
            className="duration-&lsqb;1.5s&rsqb; animate-spin transition-all"
            size={20}
          />
          <span>Creating note</span>
        </div>
      ),
      duration: 24 * 60 * 1000,
    });

    try {
      const createdNote = await addNote({
        author: {
          email: user.primaryEmailAddress?.emailAddress ?? "null@null.null",
          emailVerified:
            user.primaryEmailAddress?.verification.status === "verified",
          id: user.id,
          image: user.imageUrl,
          username: user.username!,
        },
        authorId: user.id,
        collaborators: [],
        comments: [],
        editorState: JSON.stringify(null),
        medias: [],
        title: "Untitled",
      });

      if (createdNote?.data!.id) router.push(`/note/${createdNote?.data.id}`);
    } catch (error) {
      console.error("ERROR CREATING NOTE!", error);
      dismiss();
      toast({
        title: "Error creating new note",
        variant: "destructive",
      });
    } finally {
      dismiss();
    }
  };

  return (
    <div className="absolute bottom-4 right-4 z-40 md:bottom-6 md:right-14">
      <DropdownMenu modal={true} open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger>
          <div
            onClick={() => setOpen((p) => !p)}
            className={`${open ? "border-b-2" : "border-b-[6px]"} grid aspect-square h-12 w-12 place-items-center gap-2 rounded-full border-2 border-b-[6px] border-violet-600 bg-violet-500 text-sm text-white ring-4 ring-transparent transition-all duration-200 ease-in hover:border-b-2 hover:border-violet-500 hover:bg-violet-500 hover:ring-violet-300/50 dark:border-violet-700 dark:bg-violet-500 dark:text-white dark:hover:border-violet-400/50 dark:hover:border-violet-700 dark:hover:bg-violet-500 dark:hover:ring-violet-300/10`}
          >
            <PlusIcon
              size={24}
              className={`${open ? "-rotate-[135deg]" : "rotate-0"} transition-all duration-200 ease-out`}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-4">
          <DropdownMenuItem asChild>
            <Button
              onClick={() => createNote()}
              className="flex w-[40dvw] place-items-center justify-start gap-4 align-middle md:w-full"
            >
              <IoDocument size={16} /> New note
            </Button>
          </DropdownMenuItem>

          <Link href={""}>
            <DropdownMenuItem className="flex w-[40dvw] place-items-center justify-start gap-4 align-middle md:w-full">
              <SquareCheckBig size={16} /> Add a task
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FAB;
