import { cn } from "@/lib/utils";
import { HTMLProps, ReactNode } from "react";

interface Props extends React.HTMLAttributes<any> {
  children: ReactNode;
  size?: 1 | 2 | 3 | 4;
}

const PolHeading = ({ children, size = 1, className, ...rest }: Props) => {
  const heading = () => {
    switch (size) {
      case 1:
        return (
          <h1
            className={cn("text-3xl font-extrabold tracking-tight  text-gray-800 dark:text-gray-100", className)}
            {...rest}
          >
            {children}
          </h1>
        );
      case 2:
        return (
          <h2
            className={cn("text-2xl font-semibold tracking-tight text-gray-800 dark:text-gray-100", className)}
            {...rest}
          >
            {children}
          </h2>
        );
      case 3:
        return (
          <h3
            className={cn("text-xl font-semibold tracking-tight text-gray-800 dark:text-gray-100", className)}
            {...rest}
          >
            {children}
          </h3>
        );
      case 4:
        return (
          <h4
            className={cn("text-lg font-semibold tracking-tight text-gray-800 dark:text-gray-100", className)}
            {...rest}
          >
            {children}
          </h4>
        );
    }
  };
  return heading();
};

export default PolHeading;
