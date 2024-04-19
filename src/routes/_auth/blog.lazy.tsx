import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import StylesDemoView from "@/views/StylesDemoView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/blog")({
  component: withAccess(StylesDemoView, AccessKeys.User),
});
