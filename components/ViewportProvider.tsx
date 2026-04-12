"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

interface ViewportContextValue {
  headerVisible: boolean;
  lockHeader: () => void;
}

const ViewportContext = createContext<ViewportContextValue>({
  headerVisible: true,
  lockHeader: () => {},
});

export function useViewport() {
  return useContext(ViewportContext);
}

const HEADER_HEIGHT = 56;
const DEAD_ZONE = 5;

export function ViewportProvider({ children }: { children: ReactNode }) {
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const isLockedRef = useRef(false);
  const lockTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { scrollY } = useScroll();

  const lockHeader = useCallback(() => {
    isLockedRef.current = true;
    setHeaderVisible(true);
    clearTimeout(lockTimeoutRef.current);
    lockTimeoutRef.current = setTimeout(() => {
      isLockedRef.current = false;
    }, 1200);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // While locked (programmatic scroll from nav), keep header visible
    if (isLockedRef.current) {
      lastScrollY.current = latest;
      return;
    }

    const delta = latest - lastScrollY.current;

    // Always show at top of page
    if (latest < HEADER_HEIGHT) {
      setHeaderVisible(true);
      lastScrollY.current = latest;
      return;
    }

    // Dead-zone: ignore micro-scrolls
    if (Math.abs(delta) < DEAD_ZONE) return;

    // Scrolling up → show, scrolling down → hide
    setHeaderVisible(delta < 0);
    lastScrollY.current = latest;
  });

  // Sync CSS custom property
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--header-offset",
      headerVisible ? `${HEADER_HEIGHT}px` : "0px"
    );
  }, [headerVisible]);

  return (
    <ViewportContext.Provider value={{ headerVisible, lockHeader }}>
      {children}
    </ViewportContext.Provider>
  );
}
