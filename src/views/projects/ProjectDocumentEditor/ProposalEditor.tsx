import PolEntityDropdown from "@/components/polComponents/PolEntityDropdown";
import PolTable from "@/components/polComponents/PolTable";
import PolTableCell from "@/components/polComponents/PolTableCell";
import PolTableRow from "@/components/polComponents/PolTableRow";
import { Proposal, ProposalLineItem } from "@/sdk/entities/project/ProposalLineItem";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import { useState } from "react";
import { PolButton } from "../../../components/polComponents/PolButton";
import PolInput from "../../../components/polComponents/PolInput";
import { ScrollArea } from "../../../components/ui/scroll-area";
import PolIcon from "@/components/PolIcon";
import PolTableHeader from "@/components/polComponents/PolTableHeader";

interface Props {
  proposal: Proposal;
  onProposalSaved: (proposal: Proposal) => any;
  workingPhases: WorkingPhase[];
}

const ProposalEditor = ({ proposal, workingPhases, onProposalSaved }: Props) => {
  const [title, setTitle] = useState(proposal?.Title);
  const [notes, setNotes] = useState(proposal?.Notes);
  const [lineItems, setLineItems] = useState(proposal?.Phases);

  const updatePhases = (id: string, newProps: Partial<ProposalLineItem>) => {
    setLineItems((prevLineItems) =>
      prevLineItems.map((lineItem) => (lineItem.Id === id ? { ...lineItem, ...newProps } : lineItem)),
    );
  };

  return (
    <div className="min-w-[80dvw]">
      <h1 className="mb-5 text-center text-2xl font-medium">Detail</h1>

      <div className="flex min-w-[45dvw] flex-row gap-1">
        <PolInput
          className="w-96"
          type="text"
          onValueChanged={(e) => setTitle(e)}
          value={title}
          label="Title"
        ></PolInput>
        <PolInput
          className="w-96"
          type="Notes"
          onValueChanged={(e) => setNotes(e)}
          value={notes}
          label="Notes"
        ></PolInput>
      </div>
      <div className="mb-3 mt-3 border-b"></div>
      <div className="grid grid-flow-col">
        <h1 className="mb-5 text-center text-2xl font-medium">Line Items</h1>
        <PolButton
          className="ml-auto flex"
          onClick={() => setLineItems((prevItems) => [...prevItems, new ProposalLineItem()])}
        >
          <div className="flex">
            <PolIcon name="Plus" className="mr-2"></PolIcon> {"New Line Item"}
          </div>
        </PolButton>
      </div>
      <ScrollArea className="m-5 h-96">
        <PolTable
          items={lineItems}
          header={() => (
            <PolTableHeader>
              <PolTableCell className="text-left">Title</PolTableCell>
              <PolTableCell className="text-left font-medium">Description</PolTableCell>
              <PolTableCell className="text-left font-medium">Notes</PolTableCell>
              <PolTableCell className="w-[250px] text-left font-medium">Working Phase</PolTableCell>
              <PolTableCell className="w-[100px] text-left font-medium">Amount</PolTableCell>
              <PolTableCell className="text-left font-medium"> </PolTableCell>
            </PolTableHeader>
          )}
          itemTemplate={(lineItem) => (
            <PolTableRow key={lineItem.Id}>
              <PolTableCell className="text-left">
                <PolInput
                  onValueChanged={(newValue) => {
                    updatePhases(lineItem.Id, { Title: newValue });
                  }}
                  type="text"
                  value={lineItem.Title}
                ></PolInput>
              </PolTableCell>
              <PolTableCell className="text-left">
                <PolInput
                  onValueChanged={(newValue) => {
                    updatePhases(lineItem.Id, {
                      Description: newValue,
                    });
                  }}
                  type="text"
                  value={lineItem.Description}
                ></PolInput>
              </PolTableCell>
              <PolTableCell>
                <PolInput
                  onValueChanged={(newValue) => {
                    updatePhases(lineItem.Id, { Notes: newValue });
                  }}
                  type="text"
                  value={lineItem.Notes}
                ></PolInput>
              </PolTableCell>
              <PolTableCell>
                <PolEntityDropdown
                  allowClear={true}
                  className="w-[250px]"
                  selectedId={lineItem.WorkingPhaseId}
                  placeHolder="(Create Working Phase)"
                  onValueChanged={(newValue) => {
                    updatePhases(lineItem.Id, {
                      WorkingPhaseId: newValue?.id,
                    });
                  }}
                  options={workingPhases}
                  nameGetter={(value) => value.DisplayName}
                />
              </PolTableCell>
              <PolTableCell>
                <PolInput
                  onValueChanged={(newValue) => {
                    updatePhases(lineItem.Id, {
                      AmountAllotted: newValue,
                    });
                  }}
                  type="number"
                  value={lineItem.AmountAllotted}
                ></PolInput>
              </PolTableCell>

              <PolTableCell>
                <PolButton
                  variant="ghost"
                  onClick={() => {
                    setLineItems((prevRoleRates) => prevRoleRates.filter((p) => p.Id !== lineItem.Id));
                  }}
                >
                  <PolIcon name="Minus" className="ms-2 hover:cursor-pointer"></PolIcon>
                </PolButton>
              </PolTableCell>
            </PolTableRow>
          )}
        />
      </ScrollArea>
      <div className="flex w-full items-center justify-between">
        <PolButton
          onClick={() =>
            onProposalSaved && onProposalSaved({ ...proposal, Title: title, Notes: notes, Phases: lineItems })
          }
          className="mx-auto mt-3"
        >
          Save Changes
        </PolButton>
      </div>
    </div>
  );
};

export default ProposalEditor;
