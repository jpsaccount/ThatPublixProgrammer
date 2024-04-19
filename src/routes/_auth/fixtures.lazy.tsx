import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import FixtureSearchView from "@/views/design/FixtureSearchView/FixtureSearchView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/fixtures")({
  component: withAccess(FixtureSearchView, AccessKeys.FixtureCatalog),
});
