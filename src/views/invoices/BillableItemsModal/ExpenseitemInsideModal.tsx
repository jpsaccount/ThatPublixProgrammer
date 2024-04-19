import { LabelSection } from "@/components/LabelSection/LabelSection";
import { PolButton } from "@/components/polComponents/PolButton";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolSkeleton from "@/components/polComponents/PolSkeleton";
import PolText from "@/components/polComponents/PolText";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { ChargeTable } from "@/sdk/entities/billing/ChargeTable";
import { Expense } from "@/sdk/entities/billing/Expense";
import { ExpenseReport } from "@/sdk/entities/billing/ExpenseReport";
import { RetainageItem } from "@/sdk/entities/billing/RetainageItems";
import { User } from "@/sdk/entities/core/User";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { useState } from "react";

export function ExpenseItemInsideModal({
  expense: expense,
  addExpenseItem: addExpenseItem,
}: {
  expense: Expense;
  addExpenseItem: (itemId: string, chargeTableItemType: keyof ChargeTable) => void;
}) {
  const [isAdded, setIsAdded] = useState(false);

  const expenseReportRequest = useDbQueryFirst(ExpenseReport, `WHERE c.id = "${expense.ExpenseReportId}"`);
  const userRequest = useDbQueryFirst(User, `WHERE c.id = "${expenseReportRequest.data?.UserId}"`, {
    enabled: isUsable(expenseReportRequest.data),
  });
  return (
    <Card key={expense.id}>
      <CardHeader className="min-h-8">
        <div className="flex items-center justify-between gap-10">
          <PolText type="bold">Expense</PolText>
          <div className="flex space-x-2">
            <PolRequestPresenter
              request={userRequest}
              onLoading={() => <PolSkeleton className="h-4 w-20" color="var(--accent-700)" />}
              onSuccess={() => <PolText type="muted">{getFullName(userRequest.data?.Person)}</PolText>}
            />
            <PolText type="muted">-</PolText>
            <PolText type="muted">{expense.CreatedDateTime.format("MM-DD-YYYY")}</PolText>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-4">
        <div className="flex justify-between">
          <LabelSection label="Title">
            <PolText>{expense.MerchantName}</PolText>
          </LabelSection>
          <LabelSection label="Description">
            <PolText>{expense.LineItems.map((x) => x.Description).join(", ")}</PolText>
          </LabelSection>
        </div>
        <PolButton
          className="w-full"
          onClick={() => {
            addExpenseItem(expense.id, "ExpenseItems");
            setIsAdded(true);
          }}
          disabled={isAdded}
        >
          {isAdded ? "Added" : "Add"}
        </PolButton>
      </CardContent>
    </Card>
  );
}
