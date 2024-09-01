import { useState, useEffect } from "react";

// Define the screen types
type ScreenType = "mb" | "tb" | "dk";

// Define the return type of our hook
interface ScreenInfo {
  type: ScreenType;
  width: number;
}

const breakpoints = {
  mobile: 640,
  tablet: 1024,
};

const getScreenType = (width: number): ScreenType => {
  if (width < breakpoints.mobile) return "mb";
  if (width < breakpoints.tablet) return "tb";
  return "dk";
};

const useMediaQuery = (): ScreenInfo => {
  const [screenInfo, setScreenInfo] = useState<ScreenInfo>(() => {
    // Check if window is defined (for SSR)
    if (typeof window !== "undefined") {
      return {
        type: getScreenType(window.innerWidth),
        width: window.innerWidth,
      };
    }
    // Default to desktop for SSR
    return { type: "dk", width: breakpoints.tablet };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const type = getScreenType(width);

      setScreenInfo((currentInfo) => {
        // Only update if the type or width has changed
        if (currentInfo.type !== type || currentInfo.width !== width) {
          return { type, width };
        }
        return currentInfo;
      });
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures effect is only run on mount and unmount

  return screenInfo;
};

export default useMediaQuery;
