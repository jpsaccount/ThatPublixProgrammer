import { TableHead } from "@/components/ui/table";
import { DOMAttributes, ReactNode } from "react";

interface Props extends DOMAttributes<any> {
  children: ReactNode;
  className?: string;
}
export default function PolTableHead({ children, ...props }: Props) {
  return <TableHead {...props}>{children}</TableHead>;
}
