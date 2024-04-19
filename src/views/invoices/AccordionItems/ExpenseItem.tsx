import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolSkeleton from "@/components/polComponents/PolSkeleton";
import PolTableCell from "@/components/polComponents/PolTableCell";
import PolTableRow from "@/components/polComponents/PolTableRow";
import PolText from "@/components/polComponents/PolText";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { Expense } from "@/sdk/entities/billing/Expense";
import { ExpenseReport } from "@/sdk/entities/billing/ExpenseReport";
import { User } from "@/sdk/entities/core/User";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import { tryGetSum } from "@/sdk/utils/arrayUtils";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import { toUsdString } from "@/sdk/utils/moneyUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";

export function ExpenseItem({ id, onDelete }: { id: string; onDelete: (id: string) => void }) {
  const request = useDbQueryFirst(Expense, `WHERE c.id = "${id}"`);
  const workingPhaseRequest = useDbQueryFirst(WorkingPhase, `WHERE c.id = "${request.data?.WorkingPhaseId}"`, {
    enabled: isUsable(request.data),
  });

  const usersRequest = useDbQuery(User);

  const expenseReportRequest = useDbQueryFirst(ExpenseReport, `WHERE c.id = "${request.data?.ExpenseReportId}"`, {
    enabled: isUsable(request.data),
  });

  return (
    <PolRequestPresenter
      request={[request, usersRequest]}
      containerClassName="contents"
      onLoading={() => (
        <PolTableRow key={id}>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
          <PolTableCell>
            <PolSkeleton className="h-10 w-full" />
          </PolTableCell>
        </PolTableRow>
      )}
      onSuccess={() => (
        <PolTableRow key={id}>
          <PolTableCell> </PolTableCell>
          <PolTableCell>
            <PolText>{request.data.TxnDate.format("MM-DD-YYYY")}</PolText>
          </PolTableCell>
          <PolTableCell>
            <PolRequestPresenter
              request={workingPhaseRequest}
              onLoading={() => <PolSkeleton className="h-10" />}
              onSuccess={() => <PolText>{workingPhaseRequest.data.DisplayName}</PolText>}
            />
          </PolTableCell>
          <PolTableCell>
            <PolRequestPresenter
              request={expenseReportRequest}
              onLoading={() => <PolSkeleton className="h-10" />}
              onSuccess={() => (
                <PolText>
                  {getFullName(usersRequest.data?.find((x) => x.id === expenseReportRequest.data.UserId)?.Person)}
                </PolText>
              )}
            />
          </PolTableCell>

          <PolTableCell>
            <PolText>{request.data.MerchantName}</PolText>
          </PolTableCell>

          <PolTableCell>
            <PolText>{request.data.LineItems.map((x) => x.Description).join(" + ")}</PolText>
          </PolTableCell>
          <PolTableCell>
            <PolText className="text-center">{tryGetSum(request.data.LineItems.map((x) => x.Amount))}</PolText>
          </PolTableCell>
          <PolTableCell>
            <PolText className="text-center">{toUsdString(request.data.CurrencyRateToUsd)}</PolText>
          </PolTableCell>
          <PolTableCell>
            <PolText className="text-right">{toUsdString(request.data.AmountUsd)}</PolText>
          </PolTableCell>
          <PolTableCell>
            <PolButton variant="ghost" onClick={() => onDelete(id)}>
              <PolIcon name="ListX"></PolIcon>
            </PolButton>
          </PolTableCell>
        </PolTableRow>
      )}
    ></PolRequestPresenter>
  );
}
