import PolSpinner from "@/components/polComponents/PolSpinner";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { useQrCodeRedirectParams } from "@/routes/_public/q/$q.lazy";
import { QrCode } from "@/sdk/entities/core/QrCode";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { useEffect } from "react";

export default function QrCodeRedirect() {
  const { q } = useQrCodeRedirectParams();

  console.log("load");

  const qrCode = useDbQueryFirst(QrCode, "WHERE c.id = '" + q + "'");
  const navigate = usePolNavigate();
  useEffect(() => {
    let url = qrCode.data?.Url;
    if (isUsable(url) === false) return;
    const urlDotComIndex = url.indexOf(".com");
    if (urlDotComIndex > -1) {
      url = url.substring(urlDotComIndex + 4);
    }
    navigate({ to: url, replace: true });
  }, [qrCode.data]);

  return (
    <div className="center-Items absolute bottom-0 left-0 right-0 top-0 grid h-full">
      <PolSpinner className="m-auto" IsLoading={true} />
    </div>
  );
}
