import React from "react";
import { History } from "lucide-react";

import NotesCarousel from "./notes_carousel";

const RecentNotes = () => {
  return (
    <div className="my-4 w-full lg:w-[70vw]">
      <div className="py-4">
        <h4 className="justify flex place-items-center gap-2 px-4 align-middle text-base text-neutral-500 lg:text-xs lg:font-semibold">
          <History size={16} className="hidden lg:block" /> Jump back in
        </h4>
      </div>
      <div>
        <NotesCarousel />
      </div>
    </div>
  );
};

export default RecentNotes;
