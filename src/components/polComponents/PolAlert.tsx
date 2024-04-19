import { PolButton } from "@/components/polComponents/PolButton";
import { DialogTrigger } from "@/components/ui/dialog";
import { AlertContext, useAlert } from "@/contexts/AlertContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import PolModal from "./PolModal";
import PolText from "./PolText";
import PolHeading from "./PolHeading";
import { useContext } from "react";
import { isNullOrWhitespace } from "@/utilities/stringUtils";

export default function PolAlert() {
  const alertContext = useContext(AlertContext);
  const { hideAlert } = useAlert();

  const handleConfirm = () => {
    alertContext.alertState.onConfirm?.();
    hideAlert();
  };

  const handleCancel = () => {
    alertContext.alertState.onCancel?.();
    hideAlert();
  };

  return (
    <PolModal
      className="p-5 md:max-w-[50dvw] lg:max-w-[20dvw]"
      isOpen={alertContext.alertState.isOpen}
      onOpenChanged={handleCancel}
      showCloseButton={false}
      heading={
        <div>
          <PolHeading size={3}>{alertContext.alertState.title}</PolHeading>
          <PolText className="mb-2">{alertContext.alertState.description}</PolText>
        </div>
      }
    >
      <div className="grid grid-flow-col space-x-20 px-5">
        <PolButton data-testid="cancelAlert" variant="ghost" onClick={handleCancel}>
          {isNullOrWhitespace(alertContext.alertState.cancelTitle) ? "Cancel" : alertContext.alertState.cancelTitle}
        </PolButton>
        <PolButton data-testid="confirmAlert" variant={"default"} onClick={handleConfirm}>
          {isNullOrWhitespace(alertContext.alertState.confirmTitle) ? "Confirm" : alertContext.alertState.confirmTitle}
        </PolButton>
      </div>
    </PolModal>
  );
}
