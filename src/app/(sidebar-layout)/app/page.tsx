import React from "react";
import RecentNotes from "../_components/recent_notes";
import UpcomingSchoolEvents from "../_components/upcoming_school_events";
import WelcomeComp from "./_components/welcome";

const Home = () => {
  return (
    <div className="mx-auto grid w-full place-items-center py-4 align-middle lg:w-[80vw]">
      <div className="w-full p-2 lg:px-16">
        <WelcomeComp />
        <RecentNotes />
        <UpcomingSchoolEvents />
      </div>
    </div>
  );
};

export default Home;
