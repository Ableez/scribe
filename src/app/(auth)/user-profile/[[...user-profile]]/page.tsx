import BackButton from "@/app/create/_components/back";
import { UserButton, UserProfile } from "@clerk/nextjs";
import React from "react";

const Profile = () => {
  return (
    <div className="mx-auto grid max-w-screen-md place-items-center pb-4">
      <BackButton />
      <UserProfile
        appearance={{
          baseTheme: { __type: "prebuilt_appearance" },
          layout: { animations: true },
          elements: {
            formContainer: "shadow-none",
            profilePage__account: "shadow-none"
          }
          
        }}
        path="/user-profile"
      />
    </div>
  );
};

export default Profile;
