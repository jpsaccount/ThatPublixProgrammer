import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import LocationTest from "@/views/location/LocationTest";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/location")({
  component: withAccess(LocationTest, AccessKeys.User),
});
