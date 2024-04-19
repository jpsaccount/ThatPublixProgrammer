import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as React from "react";

import { useScrollRestoration } from "@/customHooks/useScrollRestoration";
import { cn } from "@/lib/utils";
import { ScrollAreaProps } from "@radix-ui/react-scroll-area";
import { CSSProperties, RefAttributes } from "react";

interface Props extends Omit<ScrollAreaProps & RefAttributes<HTMLDivElement>, "ref"> {
  containerClassName?: string;
  persistScrollingId?: string;
  style?: CSSProperties;
}

const ScrollArea = React.forwardRef<React.ElementRef<typeof ScrollAreaPrimitive.Root>, Props>(
  ({ className, containerClassName, children, persistScrollingId, style, ...props }, ref) => {
    const internalRef = React.useRef<HTMLDivElement>(null);

    const setRefs = (node: HTMLDivElement) => {
      internalRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
        if (node?.style) node.style.minHeight = "100%";
      }
    };
    useScrollRestoration(persistScrollingId, internalRef);
    return (
      <ScrollAreaPrimitive.Root
        className={cn("relative overflow-hidden", "h-full", className)}
        style={style}
        {...props}
      >
        {isIOS() ? (
          <div
            ref={setRefs}
            className={cn("h-full w-full rounded-[inherit] overflow-auto", containerClassName)}
            style={style}
            {...props}
          >
            {children}
          </div>
        ) : (
          <>
            {" "}
            <ScrollAreaPrimitive.Viewport
              style={style}
              className={cn("h-full w-full rounded-[inherit] ", containerClassName)}
              {...props}
              ref={setRefs}
            >
              {children}
            </ScrollAreaPrimitive.Viewport>
            <ScrollBar />
            <ScrollAreaPrimitive.Corner />
          </>
        )}
      </ScrollAreaPrimitive.Root>
    );
  },
);
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
const isIOS = (): boolean => {
  if (typeof window !== "undefined" && window.navigator) {
    return /iPad|iPhone|iPod/.test(window.navigator.userAgent) && !(window as any).MSStream;
  }
  return false;
};
const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
        "flex touch-none select-none transition-colors",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
});
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
