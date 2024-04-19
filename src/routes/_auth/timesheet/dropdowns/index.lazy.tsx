import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import PhaseActivityBucketListView from "@/views/timesheet/phaseActivityBucket/PhaseActivityBucketListView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/timesheet/dropdowns/")({
  component: withAccess(PhaseActivityBucketListView, AccessKeys.TimesheetAdmin),
});
