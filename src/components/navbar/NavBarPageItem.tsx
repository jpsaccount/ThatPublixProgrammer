import { useSidebarContext } from "@/contexts/SidebarContext";
import { useAuth } from "@/customHooks/auth";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { useCallback } from "react";
import PolIcon from "../PolIcon";
import { motion } from "framer-motion";

interface Props {
  url?: string;
  title?: string;
  icon?: string;
  iconSource?: "google" | "lucide";
  level?: 1 | 2 | 3 | 4;
  userAccess?: (typeof AccessKeys)[keyof typeof AccessKeys];
}

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

export default function NavBarPageItem({ url, title, icon, iconSource, userAccess, level = 1 }: Props) {
  const navigate = usePolNavigate();
  const { hasAccess } = useAuth();
  const sidebar = useSidebarContext();
  const onClick = useCallback(() => {
    navigate({ to: url || "" });
  }, [sidebar, navigate, url]);

  if (isUsable(userAccess) && hasAccess(userAccess) === false) {
    return <></>;
  }
  return (
    <motion.li
      variants={variants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      data-testid={"navBarItem-" + title}
      onClick={onClick}
      className=" grid cursor-pointer grid-flow-col grid-cols-[auto_1fr] rounded-lg p-2 text-center transition-all hover:bg-secondary-100 dark:hover:bg-gray-700"
    >
      <PolIcon
        name={icon}
        isIconFilled={false}
        size="1.5rem"
        source={iconSource}
        className="my-auto mr-5 text-text-600 "
      />
      <p className="my-auto h-6 text-left font-medium " style={{ textWrap: "nowrap" }}>
        {title}
      </p>
    </motion.li>
  );
}
