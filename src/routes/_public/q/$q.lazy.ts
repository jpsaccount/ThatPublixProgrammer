import QrCodeRedirect from "@/views/qrcodes/QrCodeRedirect";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_public/q/$q")({
  component: QrCodeRedirect,
});

export const useQrCodeRedirectParams = Route.useParams;
