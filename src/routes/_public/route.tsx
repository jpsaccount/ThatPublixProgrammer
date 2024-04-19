import NotFoundView from "@/views/NotFoundView";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
  component: () => (
    <>
      <Outlet />
    </>
  ),
  notFoundComponent: NotFoundView,
});
