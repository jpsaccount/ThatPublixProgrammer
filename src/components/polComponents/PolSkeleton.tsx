import { cn } from "@/lib/utils";
import React from "react";
import { Skeleton } from "../ui/skeleton";
interface Props extends React.InputHTMLAttributes<any> {}

export default function PolSkeleton({ ...props }: Props) {
  return <Skeleton {...props} className={cn("bg-background-100 ", props.className)}></Skeleton>;
}
