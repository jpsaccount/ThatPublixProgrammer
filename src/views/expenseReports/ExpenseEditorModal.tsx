import PolIcon from "@/components/PolIcon";
import PolModal from "@/components/polComponents/PolModal";
import PolText from "@/components/polComponents/PolText";
import { LiveChangeContextProvider } from "@/contexts/LiveChangeContext";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { Dropdown } from "flowbite-react";
import React from "react";
import ExpenseDetailView from "./ExpenseDetailView";
import { Expense } from "@/sdk/entities/billing/Expense";
import { useDbDelete } from "@/customHooks/sdkHooks/useDbDelete";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { GlobalExpenseReport } from "@/sdk/entities/billing/GlobalExpenseReport";
import { ExpenseReport } from "@/sdk/entities/billing/ExpenseReport";
import { PolButton } from "@/components/polComponents/PolButton";
import EntityChangeViewer from "@/components/EntityChangeViewer";
import { isDevEnvironment } from "@/sdk/utils/devUtils";
import EntityChangeModalDevTools from "@/components/dev/EntityChangeModalDevTools";

interface Props {
  expense: Expense;
  onSave?: () => any;
  onDelete?: () => any;
  onCancel?: () => any;
}
export default function ExpenseEditorModal({ expense, onSave, onCancel, onDelete }: Props) {
  const deleteMutation = useDbDelete(Expense);

  const expenseReportRequest = useDbQueryFirst(ExpenseReport, `WHERE c.id = "${expense?.ExpenseReportId}"`);
  const globalExpenseReportRequest = useDbQueryFirst(
    GlobalExpenseReport,
    `WHERE c.id = "${expenseReportRequest.data?.GlobalExpenseReportId}"`,
    { enabled: isUsable(expenseReportRequest.data) },
  );
  return (
    <PolModal
      className=" w-[100dvw] md:w-fit"
      heading={
        <div className="grid grid-flow-col grid-cols-[auto_1fr] ">
          <Dropdown
            className="z-[10000]"
            arrowIcon={false}
            inline
            label={<PolIcon data-testid="more-expense-options" name="MoreVertical"></PolIcon>}
          >
            <Dropdown.Item
              data-testid="more-expense-options-delete"
              className="rounded-lg"
              onClick={() => deleteMutation.mutateAsync(expense).then(onDelete)}
            >
              Delete
            </Dropdown.Item>
          </Dropdown>

          <PolText type="bold" className="mx-auto">
            Expense
          </PolText>
        </div>
      }
      isOpen={isUsable(expense)}
      onClose={onCancel}
    >
      <div className="stackGrid">
        <EntityChangeModalDevTools type={Expense} value={expense} />
        <ExpenseDetailView
          onSave={onSave}
          globalExpenseReport={globalExpenseReportRequest?.data}
          expense={expense}
        ></ExpenseDetailView>
      </div>
    </PolModal>
  );
}
