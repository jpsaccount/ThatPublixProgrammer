import { CustomFlowbiteTheme, Flowbite, useThemeMode } from "flowbite-react";
import { useEffect } from "react";
import FlowbiteTheme from "../flowbite-theme";
import useThemeDetector from "@/customHooks/useThemeDetector";

interface FlowbiteWrapperProps {
  children: React.ReactNode;
}

const customTheme: CustomFlowbiteTheme = {
  ...FlowbiteTheme,
  timeline: {
    item: {
      point: {
        marker: {
          icon: {
            base: "bg-background-200",
            wrapper: "bg-background-200",
          },
        },
      },
    },
  },
};

export default function FlowbiteWrapper({ children }: FlowbiteWrapperProps) {
  const isSystemDarkTheme = useThemeDetector();

  return <Flowbite theme={{ mode: isSystemDarkTheme ? "dark" : "light", theme: customTheme }}>{children} </Flowbite>;
}
