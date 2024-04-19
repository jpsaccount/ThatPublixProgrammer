import { cn } from "@/lib/utils";
import PolIcon from "../PolIcon";

interface IconTextProps {
  iconName: string;
  iconSource?: "lucide" | "google";
  text: string;
  className?: string;
}

export default function IconText({ iconName, iconSource, className, text }: IconTextProps) {
  return (
    <div className={cn("font-bold flex space-x-1.5", className)}>
      <PolIcon name={iconName} source={iconSource} className={cn("my-auto", className)} />
      <p className="my-auto">{text}</p>
    </div>
  );
}
