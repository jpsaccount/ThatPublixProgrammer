import useLiveChangesIndicator from "@/customHooks/useLiveChangesIndicator";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import { Tooltip } from "@nextui-org/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  value: any;
}

export default function LiveChangeIndicator({ children, value }: Props) {
  const [showChangeName, name] = useLiveChangesIndicator(value);

  return (
    <Tooltip
      color="primary"
      isOpen={showChangeName && isNullOrWhitespace(name) === false}
      showArrow={true}
      containerPadding={2}
      placement="bottom"
      //   className=" bg-background-100"
      content={`Updated by ${name}`}
    >
      {children}
    </Tooltip>
  );
}
