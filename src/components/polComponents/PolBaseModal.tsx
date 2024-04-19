import { isUsable } from "@/sdk/utils/usabilityUtils";
import { cn } from "@nextui-org/react";
import { ReactNode, useState, useLayoutEffect, useMemo } from "react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog";
import PolText from "./PolText";
import PolIcon from "../PolIcon";

export interface PolModalProps {
  isOpen?: boolean | undefined;
  modalTrigger?: ReactNode;
  heading?: ReactNode | undefined;
  children: ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
  onOpenChanged?: (state: boolean) => void;
  className?: string;
  isModal?: boolean;
}

export function PolBaseModal({
  isOpen,
  onOpenChanged,
  heading,
  modalTrigger,
  children,
  onClose,
  showCloseButton = true,
  isModal,
  ...props
}: PolModalProps) {
  const [isModalTriggerOpen, setIsModalTriggerOpen] = useState(false);
  if (isUsable(isOpen) === false) {
    isOpen = isModalTriggerOpen;
  }

  const showContent = useMemo(() => {
    return isUsable(modalTrigger) === false
      ? isOpen
      : (isOpen && isModalTriggerOpen) || (isOpen && !isModalTriggerOpen);
  }, [isOpen, isModalTriggerOpen, modalTrigger]);

  const handleOpenChange = (state: boolean) => {
    setIsModalTriggerOpen(state);
    if (!state) {
      onClose && onClose();
    }
    onOpenChanged && onOpenChanged(state);
  };

  const [lastContent, setLastContent] = useState<ReactNode>(null);

  useLayoutEffect(() => {
    if (showContent) {
      setLastContent(children);
    }
  }, [children, isOpen, isModalTriggerOpen]);

  return (
    <Dialog modal={isModal} open={showContent} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild className={modalTrigger ? "" : "hidden"} onClick={() => setIsModalTriggerOpen((x) => !x)}>
        {modalTrigger}
      </DialogTrigger>
      <DialogContent
        showCloseButton={showCloseButton}
        {...props}
        className={cn(
          "fixed block h-fit border-2 border-background-200 bg-background-t-50 p-2 py-4 max-sm:h-[100dvh] md:h-min md:w-fit lg:p-5",
          props.className,
        )}
      >
        <DialogHeader className={cn("mb-4", showCloseButton ? "min-h-8" : "")}>
          {heading}
          {showCloseButton && (
            <DialogClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4  top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none">
              <PolIcon name="X" className="h-8 w-8" />
              <span className="sr-only">Close</span>
            </DialogClose>
          )}
        </DialogHeader>
        {showContent ? children : lastContent}
      </DialogContent>
    </Dialog>
  );
}
