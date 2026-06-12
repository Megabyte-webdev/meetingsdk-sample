import { useState, useEffect } from "react";

const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1280,
};

export function useResponsiveLayout() {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
    isMobile:
      typeof window !== "undefined"
        ? window.innerWidth < BREAKPOINTS.mobile
        : false,
    isTablet:
      typeof window !== "undefined"
        ? window.innerWidth >= BREAKPOINTS.mobile &&
          window.innerWidth < BREAKPOINTS.tablet
        : false,
    isDesktop:
      typeof window !== "undefined"
        ? window.innerWidth >= BREAKPOINTS.desktop
        : true,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        width,
        height: window.innerHeight,
        isMobile: width < BREAKPOINTS.mobile,
        isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
        isDesktop: width >= BREAKPOINTS.desktop,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
}
