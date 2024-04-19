import { useAuth } from "@/customHooks/auth";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import GlobalExpenseReportsAdminPage from "./admin/GlobalExpenseReportsAdminPage";
import GlobalExpenseReportsUserPage from "./GlobalExpenseReportsUserPage";

export default function GlobalExpenseReportMainPage() {
  const { user, hasAccess } = useAuth();
  if (hasAccess(AccessKeys.ExpenseReportAdmin)) {
    return <GlobalExpenseReportsAdminPage />;
  } else {
    return <GlobalExpenseReportsUserPage />;
  }
}
