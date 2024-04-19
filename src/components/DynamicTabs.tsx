import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useWindowDimensions from "@/customHooks/useWindowDimensions";
import { cn } from "@/lib/utils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { ReactNode, useState } from "react";
import PolHeading from "./polComponents/PolHeading";
interface tab {
  header?: string | ((isHighlighted: boolean) => ReactNode);
  value: string;
  content: ReactNode;
  showInDesktop?: boolean;
}

export interface DynamicTabProp {
  headerPosition?: "top" | "bottom";
  headerClassName?: string;
  header?: () => ReactNode;
  container?: (children: ReactNode) => ReactNode;
}

interface Props {
  tabs: tab[];
  desktopSettings?: DynamicTabProp;
  mobileSettings?: DynamicTabProp;
  title?: string;
}
const DynamicTabs = ({ tabs, title, desktopSettings, mobileSettings }: Props) => {
  const { width, height } = useWindowDimensions();
  let desktopContainer = desktopSettings?.container;
  let mobileHeader = mobileSettings?.header;
  let mobilePosition = mobileSettings?.headerPosition;
  let mobileHeaderClassName = mobileSettings?.headerClassName;
  if (isUsable(desktopContainer) == false) {
    desktopContainer = (children: ReactNode) => children;
  }
  const [selectedTab, setSelectedTab] = useState(tabs[0].value);

  const renderMobileHeader = () => {
    return (
      <>
        <div className={cn("grid-cols[1fr_auto] grid grid-flow-col border-t", mobileHeaderClassName)}>
          {mobileHeader ? (
            mobileHeader()
          ) : (
            <PolHeading size={3} className="my-auto">
              {title}
            </PolHeading>
          )}
          <TabsList>
            {tabs.map((x) => (
              <TabsTrigger value={x.value} className="rounded data-[state=active]:bg-primary-100">
                {typeof x.header === "function" ? x.header(x.value === selectedTab) : x.header ?? x.value}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </>
    );
  };
  if (width < 768) {
    return (
      <div className=" min-h-full md:hidden">
        {mobileSettings.container(
          <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value)}>
            {mobilePosition == "top" && renderMobileHeader()}

            {tabs.map((x) => (
              <TabsContent value={x.value} className={cn("m-0 h-full", mobilePosition == "top" ? "pt-24" : "pb-24")}>
                {x.content}
              </TabsContent>
            ))}
            {mobilePosition == "bottom" && renderMobileHeader()}
          </Tabs>,
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-flow-row ">
      {desktopSettings?.header ? (
        desktopSettings.header()
      ) : (
        <PolHeading size={3} className="my-auto">
          {title}
        </PolHeading>
      )}
      {desktopContainer(
        <>
          {tabs
            .filter((x) => x.showInDesktop !== false)
            .map((x) => (
              <div>{x.content}</div>
            ))}
        </>,
      )}
    </div>
  );
};

export default DynamicTabs;
