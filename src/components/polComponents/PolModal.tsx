import { ReactNode } from "react";
import { PolBaseModal } from "./PolBaseModal";

interface Props {
  isOpen?: boolean | undefined;
  modalTrigger?: ReactNode;
  heading?: ReactNode | undefined;
  children: ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
  onOpenChanged?: (state: boolean) => void;
  className?: string;
}

const PolModal = ({
  isOpen,
  onOpenChanged,
  heading,
  modalTrigger,
  children,
  onClose,
  showCloseButton = true,
  ...props
}: Props) => {
  return (
    <PolBaseModal
      isModal={true}
      isOpen={isOpen}
      onOpenChanged={onOpenChanged}
      heading={heading}
      modalTrigger={modalTrigger}
      onClose={onClose}
      showCloseButton={showCloseButton}
      {...props}
    >
      {children}
    </PolBaseModal>
  );
};

export default PolModal;
