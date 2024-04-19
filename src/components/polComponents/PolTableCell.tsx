import { TableCell } from "@/components/ui/table";
import { DOMAttributes, ReactNode } from "react";

interface Props extends DOMAttributes<any> {
  children: ReactNode;
  className?: string;
  colSpan?: number;
}

export default function PolTableCell({ children, ...props }: Props) {
  return <TableCell {...props}>{children}</TableCell>;
}
