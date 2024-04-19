import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import GlobalExpenseReportMainPage from "@/views/expenseReports/GlobalExpenseReportMainPage";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/expense/")({
  component: withAccess(GlobalExpenseReportMainPage, AccessKeys.ExpenseReport),
});
