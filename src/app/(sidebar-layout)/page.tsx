import React from "react";
import RecentNotes from "./_components/recent_notes";
import UpcomingSchoolEvents from "./_components/upcoming_school_events";

const Home = () => {
  return (
    <div className="mx-auto grid w-full place-items-center py-4 align-middle lg:w-[80vw]">
      <div className="w-full p-2 lg:px-16">
        <h4 className="text-2xl lg:text-lg">👋🏽 Welcome Ableez</h4>
        <RecentNotes />
        <UpcomingSchoolEvents />
      </div>
    </div>
  );
};

export default Home;
