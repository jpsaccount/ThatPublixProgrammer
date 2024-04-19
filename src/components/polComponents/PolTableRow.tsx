import { TableRow } from "@/components/ui/table";
import { HTMLAttributes, ReactNode } from "react";

interface Props extends HTMLAttributes<any> {
  children: ReactNode;
}
export default function PolTableRow({ children, ...props }: Props) {
  return (
    <>
      <TableRow {...props}>{children}</TableRow>
    </>
  );
}
