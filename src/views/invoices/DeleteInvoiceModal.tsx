import { PolButton } from "@/components/polComponents/PolButton";
import PolModal from "@/components/polComponents/PolModal";
import PolText from "@/components/polComponents/PolText";
import { useDbDelete } from "@/customHooks/sdkHooks/useDbDelete";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { Invoice } from "@/sdk/entities/billing/Invoice";
import React, { useContext, useState } from "react";
import { SelectedInvoiceContext } from "./contexts/SelectedInvoiceContext";

interface Props {
  open: boolean;
  onOpenChange: (state: boolean) => void;
}

export default function DeleteInvoiceModal({ open, onOpenChange }: Props) {
  const navigate = usePolNavigate();
  const { invoice, update } = useContext(SelectedInvoiceContext);

  const deleteMutation = useDbDelete(Invoice);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    deleteMutation.mutateAsync(invoice).then(() => {
      navigate({ to: "/invoices" });
      setIsDeleting(false);
    });
  };

  return (
    <>
      <PolModal onOpenChanged={onOpenChange} isOpen={open} heading="Confirmation">
        <div className="mt-2 flex max-w-[20dvw] flex-col gap-2">
          <PolText>Are you sure you want to delete this invoice?</PolText>
          <div className="grid grid-flow-col gap-2 p-2">
            <PolButton variant="outline">Cancel</PolButton>
            <PolButton data-testid="delete-button" variant="destructive" isLoading={isDeleting} onClick={handleDelete}>
              Delete
            </PolButton>
          </div>
        </div>
      </PolModal>
    </>
  );
}
