import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import PhaseActivityBucketDetailView from "@/views/timesheet/phaseActivityBucket/PhaseActivityBucketDetailView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/timesheet/dropdowns/$id")({
  component: withAccess(PhaseActivityBucketDetailView, AccessKeys.TimesheetAdmin),
});

export const usePhaseActivityBucketDetailViewParams = Route.useParams;
