import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import TimesheetReviewPage from "@/views/timesheet/timesheetReview/TimesheetReviewPage";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/timesheet/review")({
  component: withAccess(TimesheetReviewPage, AccessKeys.User),
});
