import { Drawer, DrawerProps } from "@mui/material";

export default function ({ children, ...props }: DrawerProps) {
  return <Drawer {...props}>{children}</Drawer>;
}
