import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";
import { useEffect, useState } from "react";
import PolSkeleton from "./polComponents/PolSkeleton";
import { isUsable } from "@/utilities/usabilityUtils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { isNullOrWhitespace } from "@/utilities/stringUtils";

class Props implements LucideProps {
  invertIconColors?: boolean;
  name: string;
  source?: "lucide" | "google" | "material";
  size?: string;
  hintText?: string;
  className?: string;
  isIconFilled?: boolean;
  stroke?: string;
  fill?: string;
  "data-testid"?: string;
}

export default function PolIcon({
  hintText,
  stroke = "var(--background-950)",
  name,
  source = "lucide",
  isIconFilled = false,
  className,
  size = "25px",
  ...props
}: Props) {
  let icon = null;
  if (source == "lucide") {
    icon = (
      <LucideIconLoader
        name={name}
        className={cn(className, "b-0 icon-hover-effect")}
        style={{ fontSize: size }}
        stroke={stroke}
        size={size}
        {...props}
      ></LucideIconLoader>
    );
  } else if (source == "material") {
    name = isIconFilled ? "Md" + name : "MdOutline" + name;
    icon = (
      <MaterialIconLoader
        name={name}
        className={cn(className, "b-0 icon-hover-effect")}
        style={{ fontSize: size }}
        stroke={stroke}
        size={size}
        {...props}
      ></MaterialIconLoader>
    );
  } else if (source == "google") {
    icon = (
      <GoogleIconLoader
        name={name}
        className={className}
        style={{ fontSize: size }}
        stroke={stroke}
        size={size}
        {...props}
      ></GoogleIconLoader>
    );
  }

  if (isNullOrWhitespace(hintText) === false) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger className="cursor-default">{icon}</TooltipTrigger>

          <TooltipContent className=" backdrop-blur-lg">
            <p>{hintText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } else {
    return icon;
  }
}

class IconLoaderProps extends Props {
  style?: React.CSSProperties;
}

const MaterialIconLoader: React.FC<IconLoaderProps> = ({ name, ...props }) => {
  const [IconComponent, setIconComponent] = useState<React.ElementType | null>(null);

  useEffect(() => {
    setIconComponent(null); // Reset icon on iconName change

    // Dynamically import icon
    import("react-icons/md")
      .then((icons) => {
        if (name in icons) {
          const Icon = (icons as any)[name];
          setIconComponent(() => Icon);
        } else {
          throw new Error(`Icon ${name} not found`);
        }
      })
      .catch((error) => {
        console.error("Error loading icon:", error);
      });
  }, [name]);

  return IconComponent ? (
    <IconComponent {...props}></IconComponent>
  ) : (
    <PolSkeleton
      className={cn(" icon-hover-effect rounded-full", props.className)}
      style={{ height: props.size, width: props.size }}
    />
  );
};

const GoogleIconLoader: React.FC<IconLoaderProps> = ({ name, className, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Dynamically import icon
    import("./../assets/kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oFsI.woff2")
      .then((module) => {
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error("Error loading icon:", error);
      });
  }, []);

  return isLoaded ? (
    <span
      className={cn(" icon-hover-effect", className, " material-symbols-outlined")}
      style={{ fontSize: props.size, color: props.stroke }}
      {...props}
    >
      {name}
    </span>
  ) : (
    <PolSkeleton
      className={cn(" icon-hover-effect rounded-full", className)}
      style={{ height: props.size, width: props.size }}
    />
  );
};

const LucideIconLoader: React.FC<IconLoaderProps> = ({ name, ...props }) => {
  const [IconComponent, setIconComponent] = useState<React.ElementType | null>(null);

  useEffect(() => {
    setIconComponent(null); // Reset icon on iconName change

    // Dynamically import icon
    import("lucide-react")
      .then((module) => {
        const icons = module.icons;
        if (name in icons) {
          const Icon = (icons as any)[name];
          setIconComponent(() => Icon);
        } else {
          throw new Error(`Icon ${name} not found`);
        }
      })
      .catch((error) => {
        console.error("Error loading icon:", error);
      });
  }, [name]);

  return IconComponent ? (
    <IconComponent {...props}></IconComponent>
  ) : (
    <PolSkeleton
      className={cn(" icon-hover-effect rounded-full", props.className)}
      style={{ height: props.size, width: props.size }}
    />
  );
};
