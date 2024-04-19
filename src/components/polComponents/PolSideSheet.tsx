import { ReactNode, useLayoutEffect, useState } from "react";
import { PolBaseModal, PolModalProps } from "./PolBaseModal";
import { isUsable } from "@/utilities/usabilityUtils";

export default function PolSideSheet({
  isOpen,
  onOpenChanged,
  heading,
  modalTrigger,
  children,
  onClose,
  showCloseButton = true,
  ...props
}: PolModalProps) {
  const [isModalTriggerOpen, setIsModalTriggerOpen] = useState(false);
  if (isUsable(isOpen) === false) {
    isOpen = isModalTriggerOpen;
  }

  const showContent = isUsable(modalTrigger) === false ? isOpen : isOpen && isModalTriggerOpen;

  const [lastContent, setLastContent] = useState<ReactNode>(null);

  useLayoutEffect(() => {
    if (showContent) {
      setLastContent(children);
    }
  }, [children, isOpen, isModalTriggerOpen]);
  return (
    <PolBaseModal
      isOpen={isOpen}
      onOpenChanged={onOpenChanged}
      heading={heading}
      modalTrigger={modalTrigger}
      onClose={onClose}
      showCloseButton={showCloseButton}
      {...props}
    >
      {showContent ? children : lastContent}
    </PolBaseModal>
  );
}
