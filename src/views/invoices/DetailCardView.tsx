import { LabelSection } from "@/components/LabelSection/LabelSection";
import PolIcon from "@/components/PolIcon";
import { PolDatePicker } from "@/components/polComponents/PolDatePicker";
import { PolDropdown } from "@/components/polComponents/PolDropdown";
import PolEntityDropdown from "@/components/polComponents/PolEntityDropdown";
import PolHeading from "@/components/polComponents/PolHeading";
import PolInput from "@/components/polComponents/PolInput";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolSkeleton from "@/components/polComponents/PolSkeleton";
import PolText from "@/components/polComponents/PolText";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { Invoice } from "@/sdk/entities/billing/Invoice";
import { InvoiceTerm } from "@/sdk/entities/billing/InvoiceTerm";
import { User } from "@/sdk/entities/core/User";
import { Project } from "@/sdk/entities/project/Project";
import { InvoiceStatus } from "@/sdk/enums/InvoiceStatus";
import { getEntityService } from "@/sdk/services/getEntityService";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { Dropdown, DropdownItem } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import DeleteInvoiceModal from "./DeleteInvoiceModal";
import { SelectedInvoiceContext } from "./contexts/SelectedInvoiceContext";

const statuses = [
  {
    label: "Created",
    value: InvoiceStatus.Created,
  },
  { label: "Ready To Review", value: InvoiceStatus.ReadyToReview },
  { label: "Reviewed", value: InvoiceStatus.Reviewed },
  { label: "Ready To Send", value: InvoiceStatus.ReadyToSend },
  { label: "Sent", value: InvoiceStatus.Sent },
  { label: "Paid", value: InvoiceStatus.Paid },
  { label: "Rejected", value: InvoiceStatus.Rejected },
];

export function DetailCardView() {
  const { invoice, update } = useContext(SelectedInvoiceContext);
  const invoiceTermsRequest = useDbQuery(InvoiceTerm);
  const projectsRequest = useDbQuery(Project);
  const usersRequest = useDbQuery(User);

  const [deleteIsOpen, setDeleteIsOpen] = useState(false);

  const handleOpen = () => {
    setDeleteIsOpen((prev) => !prev);
  };

  return (
    <PolRequestPresenter
      containerClassName="static top-[136px] h-fit  md:sticky md:block md:w-[340px]"
      request={[usersRequest, projectsRequest, invoiceTermsRequest]}
      onLoading={() => (
        <>
          <Card id="details-card" className="h-[80dvh] ">
            <CardHeader>
              <PolSkeleton className="h-12" />
            </CardHeader>

            <div className="grid grid-flow-row space-y-5 p-5">
              <PolSkeleton className="h-10" />
              <PolSkeleton className="h-10" />
              <PolSkeleton className="h-10" />
              <PolSkeleton className="h-10" />
              <PolSkeleton className="h-10" />
            </div>
          </Card>
        </>
      )}
      onSuccess={() => (
        <>
          <Card id="details-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <PolHeading size={4}>Details</PolHeading>
              <Dropdown
                className="z-[10000]"
                arrowIcon={false}
                inline
                label={<PolIcon data-testid="more-options-button" name="MoreVertical"></PolIcon>}
              >
                <DropdownItem onClick={handleOpen}>Delete</DropdownItem>
              </Dropdown>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <PolInput
                data-testid="internal-name-input"
                label="Internal Name"
                value={invoice.InternalName}
                onValueChanged={(x) => update({ InternalName: x })}
              ></PolInput>
              <div className="grid grid-cols-[1fr_.5fr] gap-2">
                <PolInput
                  data-testid="contract-input"
                  label="PO/Contract"
                  value={invoice.ContractNumber}
                  onValueChanged={(x) => update({ ContractNumber: x })}
                ></PolInput>
                <PolInput
                  data-testid="change-order-input"
                  value={invoice.ChangeOrderNumber}
                  label="Change Order"
                  onValueChanged={(x) => update({ ChangeOrderNumber: x })}
                ></PolInput>
              </div>
              <PolInput
                data-testid="invoice-number-input"
                label="Invoice Number"
                value={invoice.InvoiceNumber}
                onValueChanged={(x) => update({ InvoiceNumber: x })}
              ></PolInput>
              <PolRequestPresenter
                request={invoiceTermsRequest}
                onSuccess={() => (
                  <PolEntityDropdown
                    data-testid="term-dropdown"
                    label="Terms"
                    nameGetter={(x) => x.Title}
                    options={invoiceTermsRequest.data}
                    onValueChanged={(x) => update({ TermId: x.id })}
                    selectedId={invoice.TermId}
                  ></PolEntityDropdown>
                )}
              ></PolRequestPresenter>
              <div className="flex gap-2">
                <PolDatePicker
                  data-testid="invoice-date-picker"
                  label="Invoice Date"
                  value={invoice.InvoiceDate}
                  onValueChanged={(x) => update({ InvoiceDate: x })}
                ></PolDatePicker>
                <PolDatePicker
                  isDisabled={true}
                  label="Due Date"
                  value={invoice.DueDate}
                  onValueChanged={(x) => update({ DueDate: x })}
                ></PolDatePicker>
              </div>
              <PolRequestPresenter
                request={projectsRequest}
                onSuccess={() => (
                  <PolEntityDropdown
                    data-testid="project-dropdown"
                    label="Project"
                    options={projectsRequest.data}
                    nameGetter={(x) => x.Name}
                    selectedId={invoice.ProjectId}
                    onValueChanged={(x) => update({ ProjectId: x.id })}
                  ></PolEntityDropdown>
                )}
              ></PolRequestPresenter>
              <PolInput
                data-testid="project-name-input"
                label="Project Name"
                value={invoice.PdfSettings.ProjectName}
                onValueChanged={(x) =>
                  update((prev) => {
                    return { ...prev, PdfSettings: { ...prev.PdfSettings, ProjectName: x } };
                  })
                }
              ></PolInput>

              <PolDropdown
                data-testid="status-dropdown"
                label="Status"
                nameGetter={(x) => x.label}
                options={statuses}
                value={statuses.find((i) => i.value === invoice.Status ?? InvoiceStatus.Created)}
                onValueChanged={(x) =>
                  update((prev) => {
                    return { ...prev, Status: x.value };
                  })
                }
              ></PolDropdown>
              {invoice.Status === InvoiceStatus.Paid && (
                <PolInput
                  data-testid="amount-paid-input"
                  label="Amount Paid"
                  type="number"
                  onValueChanged={(x) =>
                    update((prev) => {
                      return { ...prev, AmountPaid: x };
                    })
                  }
                  value={invoice.AmountPaid}
                ></PolInput>
              )}

              <Card className="grid grid-flow-row gap-3 p-2">
                <LabelSection label="Create By">
                  <PolText type="muted" className="truncate">
                    {getFullName(usersRequest.data.find((x) => invoice.CreatedByUserId === x.id)?.Person)}
                  </PolText>
                </LabelSection>
                <LabelSection label="Last Updated By">
                  <PolText type="muted">
                    {getFullName(usersRequest.data.find((x) => invoice.ModifiedByUserId === x.id)?.Person)}
                  </PolText>
                </LabelSection>
                <LabelSection label="Last Update">
                  <PolText type="muted">{invoice?.ModifiedDateTime?.format("MM/DD/YYYY")}</PolText>
                </LabelSection>
              </Card>
            </CardContent>
          </Card>
          <DeleteInvoiceModal onOpenChange={(x) => setDeleteIsOpen(x)} open={deleteIsOpen}></DeleteInvoiceModal>
        </>
      )}
    />
  );
}
