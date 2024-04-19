import useDevice from "@/customHooks/useDevice";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface SidebarContextProps {
  isOpen: boolean;
  autoCloseOnNavigate: boolean;
  isPageWithSidebar: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextProps>(undefined!);

export function SidebarProvider({ children }: PropsWithChildren) {
  const location = window ? window.location.pathname : "/";
  const device = useDevice();
  const [isOpen, setOpen] = useState(window ? window.localStorage.getItem("isSidebarOpen") === "true" : false);

  const [autoCloseOnNavigate, setAutoCloseOnNavigate] = useState(true);
  useEffect(() => {
    window.localStorage.setItem("isSidebarOpen", isOpen.toString());
  }, [isOpen]);

  useEffect(() => {
    if (autoCloseOnNavigate) {
      setOpen(false);
    }
  }, [location]);
  // Close Sidebar on mobile tap inside main content
  useEffect(() => {
    function handleMobileTapInsideMain(event: MouseEvent) {
      const main = document.querySelector("main");
      const isClickInsideMain = main?.contains(event.target as Node);

      if (device.isMobile && isClickInsideMain) {
        setOpen(false);
      }
    }

    function close() {
      if (device.isMobile) setOpen(false);
    }

    document.addEventListener("mousedown", handleMobileTapInsideMain);
    document.addEventListener("scroll", close);
    return () => {
      document.removeEventListener("mousedown", handleMobileTapInsideMain);
      document.removeEventListener("scroll", close);
    };
  }, [device]);

  return (
    <SidebarContext.Provider
      value={{
        isOpen: isOpen,
        isPageWithSidebar: true,
        setOpen: setOpen,
        autoCloseOnNavigate: autoCloseOnNavigate,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext(): SidebarContextProps {
  const context = useContext(SidebarContext);

  if (typeof context === "undefined") {
    throw new Error("useSidebarContext should be used within the SidebarContext provider!");
  }

  return context;
}
