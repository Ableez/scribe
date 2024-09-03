"use client";
import React, { type ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
};

const ServiceWorkerWrapper = ({ children }: Props) => {
  useEffect(() => {
    function registerServiceWorker() {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((reg) => {
            console.log("Registration successful", reg);
          })
          .catch((e) => {
            console.error("Error during service worker registration:", e);
            alert("sw ERROR!");
          });
      } else {
        console.warn("Service Worker is not supported");
      }
    }

    registerServiceWorker();
  }, []);

  return <>{children}</>;
};

export default ServiceWorkerWrapper;
