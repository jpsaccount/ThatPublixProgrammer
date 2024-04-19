import RegisterationPage from "@/views/profile/login/registeration/RegisterationPage";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_public/auth/register")({
  component: RegisterationPage,
});
