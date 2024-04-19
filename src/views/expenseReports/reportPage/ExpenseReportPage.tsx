import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { Expense } from "@/sdk/entities/billing/Expense";
import ReactDataGrid from "@inovua/reactdatagrid-enterprise";
import "@inovua/reactdatagrid-enterprise/base.css";
import "../../../dataGridTheme.scss";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import { BillingStatus } from "@/sdk/enums/BillingStatus";
import { useCallback, useState } from "react";
import * as XLSX from "xlsx";
import { getUtcMoment } from "@/sdk/utils/dateUtils";
import { PolButton } from "@/components/polComponents/PolButton";
import { Currency } from "@/sdk/entities/billing/Currency";
import { ExpenseReport } from "@/sdk/entities/billing/ExpenseReport";
import { GlobalExpenseReport } from "@/sdk/entities/billing/GlobalExpenseReport";
import moment from "moment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaxCategory } from "@/sdk/entities/billing/TaxCategory";
import PolIcon from "@/components/PolIcon";
import PolText from "@/components/polComponents/PolText";
import ExpenseEditorModal from "../ExpenseEditorModal";
export default function ExpenseReportPage() {
  const expenses = useDbQuery(Expense);
  const workingPhases = useDbQuery(WorkingPhase);
  const currencies = useDbQuery(Currency);
  const expenseReports = useDbQuery(ExpenseReport);
  const globalExpenseReports = useDbQuery(GlobalExpenseReport);
  const taxCategories = useDbQuery(TaxCategory);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const generateAoA = (data: Expense[]) => {
    let aoa: any[][] = [
      [
        "Id",
        "Global Expense Report Title",
        "Amount",
        "Date",
        "Merchant Name",
        "Status",
        "Working Phase",
        "CurrencyRateToUsd",
        "Currency",
      ],
    ];

    data.forEach((expense) => {
      let row: any[] = [
        expense.id,
        globalExpenseReports.data.find(
          (x) => x.id === expenseReports.data.find((x) => x.id === expense.ExpenseReportId)?.GlobalExpenseReportId,
        ),
        expense.AmountUsd,
        expense.TxnDate?.format("MM-DD-YYYY"),
        expense.MerchantName,
        BillingStatus[expense.BillingDetails.Status],
        workingPhases.data.find((x) => x.id === expense.WorkingPhaseId)?.DisplayName,
        expense.CurrencyRateToUsd,
        currencies.data.find((x) => x.id === expense.CurrencyId)?.ShortName,
      ];
      aoa.push(row);
    });

    return aoa;
  };
  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    const data = XLSX.utils.aoa_to_sheet(generateAoA(expenses.data));
    XLSX.utils.book_append_sheet(wb, data, "data");
    XLSX.writeFile(wb, `${getUtcMoment().local().format("MM-DD-YYYY")}.xlsx`);
  };

  const [groupBy, setGroupBy] = useState([]);
  const renderGroupTitle = useCallback((value, { data }) => {
    let summary = null;

    if (data.groupColumnSummary) {
      summary = <b> Hours: {data.groupColumnSummary.Hours}</b>;
    }

    return (
      <div>
        {value}
        {summary}
      </div>
    );
  }, []);
  const gridStyle = { minHeight: 900 };
  return (
    <>
      <ExpenseEditorModal
        expense={selectedExpense}
        onCancel={() => setSelectedExpense(null)}
        onDelete={() => setSelectedExpense(null)}
        onSave={() => setSelectedExpense(null)}
      />
      <PolRequestPresenter
        request={[expenses, workingPhases]}
        onSuccess={() => (
          <div className="p-5">
            <Card>
              <CardHeader className="justify-center">
                <CardTitle className="grid grid-flow-col items-center gap-2">
                  <span>Expenses</span>
                  <PolButton variant="ghost" className="ml-auto" onClick={handleExport}>
                    <div className="flex flex-row gap-2">
                      <PolText>Export</PolText>
                      <PolIcon name="CornerRightUp" size="18" className="mb-auto" />
                    </div>
                  </PolButton>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReactDataGrid
                  style={gridStyle}
                  theme="pol-blue"
                  resizable={true}
                  idProperty="id"
                  emptyText={"No time entries available."}
                  onRowClick={(e) => setSelectedExpense(e.data)}
                  columns={[
                    {
                      name: "TxnDate",
                      header: "Date",
                      render: ({ data }) => data.TxnDate?.format("MM/DD/YYYY"),
                      defaultWidth: 100,
                      renderGroupTitle: (data, info) => {
                        const date = moment(data);
                        return (
                          <div className="flex justify-between">
                            <p>{`${date?.format("MM/DD/YYYY")}`}</p>
                          </div>
                        );
                      },
                    },
                    {
                      name: "ExpenseReportId",
                      header: "Expense Report",
                      renderGroupTitle: (data, info) => {
                        return (
                          <div className="flex justify-between">
                            <p>{`${globalExpenseReports.data.find((x) => x.id === expenseReports.data.find((y) => y.id === data)?.GlobalExpenseReportId)?.Title}`}</p>
                          </div>
                        );
                      },
                      render: ({ data }) => {
                        const expenseReport = expenseReports.data.find((x) => x.id === data.ExpenseReportId);
                        return globalExpenseReports.data.find((x) => x.id === expenseReport?.GlobalExpenseReportId)
                          ?.Title;
                      },
                      defaultWidth: 300,
                    },
                    {
                      renderGroupTitle: (data, info) => {
                        return (
                          <div className="flex justify-between">
                            <p>{`${workingPhases.data.find((x) => x.id === data.WorkingPhaseId)?.DisplayName}`}</p>
                          </div>
                        );
                      },
                      name: "WorkingPhaseId",
                      header: "Working Phase",
                      render: ({ data }) => {
                        const phase = workingPhases.data.find((p) => p.id === data.WorkingPhaseId);
                        return phase?.DisplayName;
                      },
                      defaultFlex: 1,
                    },
                    {
                      renderGroupTitle: (data: Expense, info) => {
                        return (
                          <div className="flex justify-between">
                            <p>{`${data.LineItems.flatMap((x) => taxCategories.data?.find((i) => i.id == x.CategoryId)?.Title).join(" + ")}`}</p>
                          </div>
                        );
                      },
                      header: "Categories",
                      render: ({ data }) => {
                        return data.LineItems.flatMap(
                          (x) => taxCategories.data?.find((i) => i.id == x.CategoryId)?.Title,
                        ).join(" + ");
                      },
                      defaultFlex: 1,
                    },
                    {
                      renderGroupTitle: (data: Expense, info) => {
                        return (
                          <div className="flex justify-between">
                            <p>{`${data.LineItems.flatMap((x) => x.Description).join(" + ")}`}</p>
                          </div>
                        );
                      },
                      header: "Description",
                      render: ({ data }) => {
                        return data.LineItems.flatMap((x) => x.Description).join(" + ");
                      },
                      defaultFlex: 1,
                    },
                    { name: "MerchantName", header: "Merchant Name", defaultWidth: 200 },
                    {
                      renderGroupTitle: (data, info) => {
                        return (
                          <div className="flex justify-between">
                            <p>{data + "$"}</p>
                          </div>
                        );
                      },
                      name: "AmountUsd",
                      header: "Amount (USD)",
                      render: ({ data }) => data.AmountUsd + "$",
                      defaultWidth: 150,
                    },

                    {
                      name: "CurrecyRateToUsd",
                      header: "Currency Rate to USD",
                      defaultWidth: 150,
                    },
                    {
                      name: "CurrencyId",
                      header: "Currency",
                      render: ({ data }) => {
                        const currency = currencies.data.find((c) => c.id === data.CurrencyId);
                        return currency?.ShortName;
                      },
                      defaultWidth: 150,
                    },
                    {
                      renderGroupTitle: (data, info) => {
                        return (
                          <div className="flex justify-between">
                            <p>{BillingStatus[data.Status]}</p>
                          </div>
                        );
                      },
                      name: "BillingDetails",
                      header: "Status",
                      defaultWidth: 150,
                      render: ({ data }) => BillingStatus[data.BillingDetails.Status],
                    },
                  ]}
                  renderGroupTitle={renderGroupTitle}
                  onGroupByChange={setGroupBy}
                  groupBy={groupBy}
                  dataSource={expenses.data}
                ></ReactDataGrid>
              </CardContent>
            </Card>
          </div>
        )}
      ></PolRequestPresenter>
    </>
  );
}
