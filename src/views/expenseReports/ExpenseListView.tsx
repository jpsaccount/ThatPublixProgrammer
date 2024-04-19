import { EntityAttachmentViewer } from "@/components/EntityAttachmentViewer";
import PolIcon from "@/components/PolIcon";
import EntityTableWithPagination from "@/components/polComponents/EntityTableViews/EntityTableWithPagination";
import { PolButton } from "@/components/polComponents/PolButton";
import PolHeading from "@/components/polComponents/PolHeading";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { Seo } from "@/components/polComponents/Seo";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { usePartialDbQuery } from "@/customHooks/sdkHooks/usePartialDbQuery";
import useSearchParamQueryTemplate from "@/customHooks/sdkHooks/useSearchParamQueryTemplate";
import { ExpenseLineItem } from "@/sdk/childEntities/ExpenseLineItem";
import { ContentQuality } from "@/sdk/contracts/Entity";
import { Currency } from "@/sdk/entities/billing/Currency";
import { Expense } from "@/sdk/entities/billing/Expense";
import { ExpenseReport } from "@/sdk/entities/billing/ExpenseReport";
import { GlobalExpenseReport } from "@/sdk/entities/billing/GlobalExpenseReport";
import { User } from "@/sdk/entities/core/User";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import { BillingStatus } from "@/sdk/enums/BillingStatus";
import { tryGetSum } from "@/sdk/utils/arrayUtils";
import { isBillable, isBilled } from "@/sdk/utils/billingStatusUtils";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import { toUsdString } from "@/sdk/utils/moneyUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import moment from "moment";
import { useState } from "react";
import { TaxCategory } from "@/sdk/entities/billing/TaxCategory";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import AuthSection from "@/components/AuthSection";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import { LiveChangeContextProvider } from "@/contexts/LiveChangeContext";
import useLiveChangeTracking from "@/customHooks/useLiveChangeTracking";
import ExpenseEditorModal from "./ExpenseEditorModal";
import { useExpenseListViewParams } from "@/routes/_auth/expense/$globalExpenseReportId/$expenseReportId/index.lazy";

export default function ExpenseListView() {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const { expenseReportId, globalExpenseReportId } = useExpenseListViewParams();

  const { query, searchText, setSearchText } = useSearchParamQueryTemplate(
    `WHERE c.ExpenseReportId = "${expenseReportId}" AND (c.MerchantName CONTAINS "{0}" OR c.TxnDate CONTAINS "{0}") ORDER BY c.TxnDate DESC`,
    `WHERE c.ExpenseReportId = "${expenseReportId}" ORDER BY c.TxnDate DESC`,
  );
  const expensesRequest = usePartialDbQuery(Expense, query, 50);

  const changeLog = useLiveChangeTracking(expensesRequest, (changes) => {
    if (changes.id === selectedExpense?.id) setSelectedExpense((x) => ({ ...x, ...changes }));
  });

  const workingPhaseRequest = useDbQuery(
    WorkingPhase,
    `WHERE c.id IN ["${expensesRequest.data?.Items?.map((x) => x.WorkingPhaseId).join('","')}"]`,
    { enabled: isUsable(expensesRequest.data) },
  );
  const categoriesRequest = useDbQuery(TaxCategory, "ORDER BY c.Title ASC");
  const navigate = usePolNavigate();

  const globalExpenseReportRequest = useDbQueryFirst(GlobalExpenseReport, `WHERE c.id = "${globalExpenseReportId}"`);
  const expenseReportRequest = useDbQueryFirst(ExpenseReport, `WHERE c.id = "${expenseReportId}"`);
  const user = useDbQueryFirst(User, `WHERE c.id = "${expenseReportRequest.data?.UserId}"`);
  const currencyRequest = useDbQuery(Currency);

  function CreateExpense() {
    const expense = new Expense();
    expense.ExpenseReportId = expenseReportId;
    expense.TxnDate = moment();
    expense.WorkingPhaseId = globalExpenseReportRequest.data.DefaultWorkingPhaseId;
    expense.BillingDetails.Status = BillingStatus.Billable;
    expense.CurrencyId = "1";
    expense.LineItems.push(new ExpenseLineItem());
    setSelectedExpense(expense);
  }

  return (
    <>
      <Seo title={getFullName(user.data?.Person)} />
      <PolRequestPresenter
        request={expensesRequest}
        onSuccess={() => (
          <div className="min-md:w-[60dvw] m-auto flex  flex-col">
            <LiveChangeContextProvider changeLog={changeLog}>
              <ExpenseEditorModal
                onCancel={() => setSelectedExpense(null)}
                onDelete={() => setSelectedExpense(null)}
                expense={selectedExpense}
                onSave={() => expensesRequest.refetch().then((x) => setSelectedExpense(null))}
              />
            </LiveChangeContextProvider>
            <EntityTableWithPagination
              pageTitle={
                <div className="grid grid-flow-col">
                  <div className="grid grid-flow-row">
                    <PolHeading size={1}>{globalExpenseReportRequest.data?.Title}</PolHeading>
                    <PolHeading size={4}>{getFullName(user.data?.Person)}</PolHeading>
                  </div>
                  <div className="grid grid-flow-row">
                    <PolHeading className="text-right" size={2}>
                      {toUsdString(expenseReportRequest.data?.TotalAmountUsd)}
                    </PolHeading>
                  </div>
                </div>
              }
              headerClassName="sticky top-[48px]"
              searchText={searchText}
              onSearchTextChanged={setSearchText}
              onRowClicked={(x) => setSelectedExpense(x)}
              averageItemSize={40}
              showSearch={true}
              request={expensesRequest}
              dense={false}
              emptyView={`Add your first expense!`}
              addons={[
                <PolRequestPresenter
                  containerClassName="ml-auto w-fit"
                  request={globalExpenseReportRequest}
                  onSuccess={() => (
                    <div className="mx-2  ml-auto grid grid-flow-col gap-2 md:my-0">
                      <AuthSection accessRequired={AccessKeys.ExpenseReportAdmin}>
                        <PolButton
                          tooltip="Review"
                          variant="ghost"
                          className="ml-auto"
                          onClick={() =>
                            navigate({
                              to: "/expense/$globalExpenseReportId/$expenseReportId/review",
                              params: { globalExpenseReportId, expenseReportId },
                            })
                          }
                        >
                          <PolIcon name="BarChart3" />
                        </PolButton>
                      </AuthSection>
                      <PolButton
                        variant="ghost"
                        className="ml-auto"
                        onClick={() =>
                          navigate({
                            to: "/expense/$globalExpenseReportId/$expenseReportId/print",
                            params: { globalExpenseReportId, expenseReportId },
                          })
                        }
                      >
                        <PolIcon name="Printer" />
                      </PolButton>
                      <PolButton data-testid="addExpenseButton" onClick={CreateExpense}>
                        <PolIcon name="Plus" stroke="white"></PolIcon>
                      </PolButton>
                    </div>
                  )}
                />,
              ]}
              columns={[
                {
                  id: "TxnDate",
                  label: "Date",
                  sortBy: (x) => x.TxnDate?.valueOf() ?? 0,
                  idGetter: (x) => x.TxnDate?.format("MM/DD/YYYY"),
                  width: 100,
                },
                { id: "MerchantName", label: "Merchant Name" },
                {
                  id: "WorkingPhaseId",
                  idGetter: (x) => workingPhaseRequest.data?.find((w) => w.id == x.WorkingPhaseId)?.DisplayName,
                  label: "Working Phase",
                },
                {
                  idGetter: (x) =>
                    x.LineItems.map((i) => {
                      const category = categoriesRequest.data?.find((c) => c.id === i.CategoryId)?.Title;
                      return category;
                    }).join(" + "),
                  label: "Category",
                },
                {
                  id: "LineItems",
                  idGetter: (x) => x.LineItems.map((i) => i.Description).join(" + "),
                  label: "Details",
                },
                {
                  id: "BillingDetails",
                  label: "",
                  width: 25,
                  idGetter: (x) => x.BillingDetails.Status.toString(),
                  renderCell: (x) =>
                    isBillable(x.BillingDetails.Status) ? (
                      <PolIcon
                        name="DollarSign"
                        hintText={isBilled(x.BillingDetails.Status) ? "Billed to invoice." : "Billable"}
                        isIconFilled={isBilled(x.BillingDetails.Status)}
                        className="text-green-500"
                      />
                    ) : (
                      ""
                    ),
                  align: "center",
                },
                {
                  id: "AttachmentMetadata",
                  label: "",
                  width: 25,
                  renderCell: (x) =>
                    x.AttachmentMetadata.HasAttachment ? <PolIcon name="Paperclip" hintText="Has attachment" /> : "",
                  idGetter: (x) => x.AttachmentMetadata.HasAttachment.toString(),
                  align: "center",
                },
                {
                  id: "LineItems[0].Amount",
                  width: 100,
                  idGetter: (x) => tryGetSum(x.LineItems.map((x) => x.Amount)).toString(),
                  label: "Amount",
                  align: "right",
                },
                {
                  id: "CurrencyId",
                  label: "Currency",
                  align: "center",
                  width: 100,
                  renderCell: (x) =>
                    x.CurrencyId !== "1" ? currencyRequest.data?.find((i) => i.id === x.CurrencyId)?.Symbol : "-",
                },
                {
                  id: "AmountUsd",
                  width: 150,
                  label: "Total",
                  align: "right",
                  idGetter: (x) => toUsdString(x.AmountUsd),
                },
              ]}
              orderByProperty={"TxnDate"}
              orderByDirection="desc"
              mobileRowTemplate={(x) => {
                return (
                  <>
                    <div
                      className="grid-auto-col mobile-card-item grid grid-cols-[auto_1fr_auto]"
                      onClick={() => setSelectedExpense(x)}
                      key={x.id}
                    >
                      <div className="w-12">
                        <EntityAttachmentViewer
                          entity={x}
                          quality={ContentQuality.CompressedThumbnail}
                          viewerClassName="h-[5dvh] aspect-[1] mr-2"
                          className="m-auto"
                        />
                      </div>
                      <div className="grid grid-flow-row">
                        <span className="text-left font-medium">{x.MerchantName}</span>
                        <span className="text-left text-xs">{x.LineItems.map((i) => i.Description).join(" + ")}</span>
                      </div>

                      <div className="grid grid-flow-row text-right">
                        <div className="grid grid-flow-col">
                          {isBillable(x.BillingDetails.Status) && (
                            <PolIcon
                              name="Receipt"
                              hintText={isBilled(x.BillingDetails.Status) ? "Billed to invoice." : "Billable"}
                              isIconFilled={isBilled(x.BillingDetails.Status)}
                              className="mt-1 stroke-green-500"
                              size="1rem"
                            />
                          )}
                          <div className="text-right font-medium">{toUsdString(x.AmountUsd)}</div>
                        </div>
                        <div className="text-xs">{x.TxnDate?.format("MM/DD/YYYY")}</div>
                      </div>
                    </div>
                  </>
                );
              }}
            />
          </div>
        )}
      ></PolRequestPresenter>
    </>
  );
}
