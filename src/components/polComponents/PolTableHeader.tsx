import { TableHeader } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DOMAttributes, ReactNode } from "react";

interface Props extends DOMAttributes<any> {
  children: ReactNode;
  className?: string;
}
export default function PolTableHeader({ children, className, ...props }: Props) {
  return (
    <>
      <TableHeader {...props} className={cn("z-10 bg-background-t-100 backdrop-blur", className)}>
        {children}
      </TableHeader>
    </>
  );
}
