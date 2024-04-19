import { SidebarProvider, useSidebarContext } from "@/contexts/SidebarContext";
import { useAuth } from "@/customHooks/auth";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import type { FC, PropsWithChildren } from "react";
import PolNavbar from "../navbar/NavBar";
import PolSidebar from "../navbar/SiderBar";
import { cn } from "@/lib/utils";

interface NavbarSidebarLayoutProps {
  isFooter?: boolean;
}

function ContentContainer(props) {
  const { isOpen: isSidebarOpen } = useSidebarContext();

  return (
    <div className={cn("flow relative  min-h-full w-full max-sm:p-0 ", isSidebarOpen ? "lg:ml-64" : "lg:ml-16")}>
      <MainContent isFooter={props.isFooter}>{props.content}</MainContent>
      <hr />
      <MainContentFooter />
    </div>
  );
}

const NavbarSidebarLayout: FC<PropsWithChildren<NavbarSidebarLayoutProps>> = function ({ children, isFooter = true }) {
  const { user, isLoading } = useAuth();

  const content = children;

  return (
    <SidebarProvider>
      <PolNavbar className={isUsable(user) ? "" : "hidden"} />
      <div className="flex h-full items-start pt-[50px]">
        <PolSidebar className={isUsable(user) ? "" : "hidden"} />
        <ContentContainer isFooter={isFooter} content={content}></ContentContainer>
      </div>
    </SidebarProvider>
  );
};

const MainContent: FC<PropsWithChildren<NavbarSidebarLayoutProps>> = function ({ children, isFooter }) {
  const { isOpen: isSidebarOpen } = useSidebarContext();

  return <main className={cn("flow relative min-h-[calc(100dvh-120px)] ")}>{children}</main>;
};

const MainContentFooter: FC = function () {
  return (
    <p className="my-6 text-center text-sm text-gray-500 dark:text-gray-300">
      &copy; 2009-{new Date().getFullYear()} Point of Light Inc. All rights reserved.
    </p>
  );
};

export default NavbarSidebarLayout;
