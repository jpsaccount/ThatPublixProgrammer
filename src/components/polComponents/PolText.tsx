import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Props extends React.HTMLAttributes<any> {
  children: ReactNode;
  type?: "p" | "lead" | "large" | "small" | "muted" | "bold";
  className?: string;
}

const PolText = ({ children, type = "p", className, ...rest }: Props) => {
  switch (type) {
    case "p":
      return (
        <p className={cn(`leading-7 `, className)} {...rest}>
          {children}
        </p>
      );
    case "lead":
      return (
        <p className={cn(`text-md text-muted-foreground`, className)} {...rest}>
          {children}
        </p>
      );
    case "large":
      return (
        <div className={cn(`text-lg font-semibold`, className)} {...rest}>
          {children}
        </div>
      );
    case "small":
      return (
        <p className={cn(`text-sm font-medium leading-small`, className)} {...rest}>
          {children}
        </p>
      );
    case "muted":
      return (
        <p className={cn(`text-xs text-text-600 text-muted-foreground`, className)} {...rest}>
          {children}
        </p>
      );
    case "bold":
      return (
        <p className={cn(`font-bold leading-7`, className)} {...rest}>
          {children}
        </p>
      );
  }
};

export default PolText;
