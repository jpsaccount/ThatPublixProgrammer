import { Collapse } from "@mui/material";
import { ReactNode, useState } from "react";
import PolIcon from "../PolIcon";
import PolHeading from "../polComponents/PolHeading";

interface Props {
  title?: string;
  icon?: string;
  children: ReactNode;
}

export default function NavBarGroupItem({ title, icon, children }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="grid cursor-pointer grid-flow-col  grid-cols-[auto_1fr]
            rounded-md bg-background-950 px-2 py-0.5 transition-all hover:bg-slate-100
            "
      >
        <PolIcon name={icon} isIconFilled={true} size="2rem" className="my-auto mr-5" />
        <PolHeading className=" text-left align-bottom leading-[2.5rem]	" size={4}>
          {title}
        </PolHeading>
        <PolIcon className="mb-auto ml-5 mr-0.5 mt-auto" name={isExpanded ? "ChevronUp" : "ChevronDown"} />
      </div>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit style={{}}>
        {children}
      </Collapse>
    </div>
  );
}
