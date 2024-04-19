import PolIcon from "@/components/PolIcon";
import { PolDropdown } from "@/components/polComponents/PolDropdown";
import PolEntityDropdown from "@/components/polComponents/PolEntityDropdown";
import PolHeading from "@/components/polComponents/PolHeading";
import PolInput from "@/components/polComponents/PolInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { ExpenseLineItem } from "@/sdk/childEntities/ExpenseLineItem";
import { TaxCategory } from "@/sdk/entities/billing/TaxCategory";
import { ChangeEvent } from "react";

interface Props {
  lineItems: ExpenseLineItem[];
  onChange: (updatedLineItems: ExpenseLineItem[]) => void;
}

export default function ExpenseLineItems({ lineItems, onChange }: Props) {
  const categoriesRequest = useDbQuery(TaxCategory, "ORDER BY c.Title ASC");

  const handleInputChange = (index: number, update: Partial<ExpenseLineItem>) => {
    const updatedLineItems = [...lineItems];
    updatedLineItems[index] = { ...updatedLineItems[index], ...update };
    onChange(updatedLineItems);
  };

  const deleteLineItem = (index: number) => {
    const updatedLineItems = [...lineItems];
    updatedLineItems.splice(index, 1);
    onChange(updatedLineItems);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="grid grid-flow-col grid-cols-[1fr_auto]">
        <PolHeading size={4}>Line Items - {lineItems?.length}</PolHeading>
        <button className="w-fit" onClick={() => onChange([...lineItems, new ExpenseLineItem()])}>
          <PolIcon name="PlusCircle" />
        </button>
      </div>
      <ScrollArea className="h-[200px]" containerClassName="overflow-auto">
        {lineItems.map((x, index) => (
          <div className="mt-2 grid grid-flow-row border-t">
            <div className="my-2 grid grid-flow-col grid-cols-[auto_1fr] space-x-2" key={index}>
              <button className="m-auto" tabIndex={-1} onClick={() => deleteLineItem(index)}>
                <PolIcon className="m-auto ml-2 h-5 cursor-pointer" name="Trash"></PolIcon>
              </button>
              <PolEntityDropdown
                placeHolder="Tax Category"
                isSearchable={false}
                nameGetter={(x) => x.Title}
                selectedId={x.CategoryId}
                optionsRequest={categoriesRequest}
                onValueChanged={(e) => handleInputChange(index, { CategoryId: e.id })}
              />
            </div>
            <div className="grid grid-flow-col grid-cols-[1fr_.5fr] gap-2">
              <PolInput
                className="w-[unset]"
                data-testid="descriptionInput"
                placeholder="Description"
                value={x.Description}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(index, { Description: e.target.value })
                }
              ></PolInput>
              <PolInput
                data-testid="amountInput"
                className="text-right"
                type="currency"
                placeholder="Amount"
                containerClassName=""
                value={x.Amount}
                onValueChanged={(e) => handleInputChange(index, { Amount: e })}
              ></PolInput>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
