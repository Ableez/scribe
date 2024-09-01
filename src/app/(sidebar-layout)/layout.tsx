"use client";
import React from "react";
import Sidebar from "@/components/sidebar";
import MobileNavbar from "@/components/mobile-navbar";
import DesktopNavbar from "@/components/desktop-navbar";
import FAB from "./_components/fab";

type Props = {
  children: React.ReactNode;
};

const SidebarLayout = ({ children }: Props) => {
  return (
    <div className="relative flex h-screen overflow-hidden">
      <FAB />
      <Sidebar />
      <div className="h-screen flex-1 overflow-scroll transition-all duration-300 ease-in-out">
        <MobileNavbar />
        <DesktopNavbar />
        {children}
      </div>
    </div>
  );
};

export default SidebarLayout;
