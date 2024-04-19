import { createLazyFileRoute } from "@tanstack/react-router";
import MainAuthPage from "@/views/profile/login/MainAuthPage";

export const Route = createLazyFileRoute("/_public/auth/login")({
  component: MainAuthPage,
});
