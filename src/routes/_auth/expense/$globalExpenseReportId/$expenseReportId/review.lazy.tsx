import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import ExpenseReportReview from "@/views/expenseReports/admin/ExpenseReportReview";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/expense/$globalExpenseReportId/$expenseReportId/review")({
  component: withAccess(ExpenseReportReview, AccessKeys.ExpenseReportAdmin),
});

export const useExpenseReportReviewParams = Route.useParams;
