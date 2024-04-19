import { cn } from "@/lib/utils";
import { Spinner } from "@nextui-org/react";
interface Props {
  IsLoading?: boolean | undefined;
  className?: string | undefined;
  size?: string;
  variant?: "primary" | "secondary" | "error" | "info" | "success" | "warning" | "inherit";
}
export default function PolSpinner({ IsLoading = true, className, size = "40px", variant: color = "primary" }: Props) {
  return (
    IsLoading && (
      <Spinner
        className={className}
        color={color === "primary" ? "primary" : "secondary"}
        classNames={{
          wrapper: cn(className),
        }}
      />
    )
  );
}
