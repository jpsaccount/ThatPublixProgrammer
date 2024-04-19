import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import WeeklyTimesheetEditor from "@/views/timesheet/WeeklyTimesheetEditor/WeeklyTimesheetEditor";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/timesheet/")({
  component: withAccess(WeeklyTimesheetEditor, AccessKeys.Timesheet),
});
