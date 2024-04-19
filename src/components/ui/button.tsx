import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary-400/95 text-primary-foreground hover:bg-primary-500 text-white dark:text-gray-300 primary-button",
        destructive: "bg-red-600 dark:bg-red-700 text-white destructive-button ",
        outline: "border border-input bg-background hover:bg-secondary-50  outline-button text-text-900",
        secondary:
          "bg-primary-100/90 hover:bg-primary-50/90 border border-primary-200 text-secondary-foreground secondary-button text-text-900",
        ghost: "hover:bg-secondary-50 hover:text-accent-foreground dark:hover:bg-gray-700 text-text-950 ghost-button",
        link: "text-primary underline-offset-4 hover:underline link-button",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  "data-testid"?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
