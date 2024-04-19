import { PolButton } from "@/components/polComponents/PolButton";
import PolSpinner from "@/components/polComponents/PolSpinner";
import PolText from "@/components/polComponents/PolText";
import useDevice from "@/customHooks/useDevice";
import { Font, PDFDownloadLink } from "@react-pdf/renderer";
import moment, { Moment } from "moment";
import { ReactElement, ReactNode, Suspense, lazy, useEffect, useState } from "react";

const PDFViewer = lazy(() => import("@react-pdf/renderer").then((module) => ({ default: module.PDFViewer })));
interface Props {
  downloadOnly?: boolean;
  children: ReactElement;
  onLoaded: () => any;
}
export default function PdfView({ children, downloadOnly, onLoaded }: Props) {
  const device = useDevice();
  const [isFinished, setIsFinished] = useState(null);

  useEffect(() => {
    setIsFinished(false);
  }, []);

  function setFinish() {
    if (isFinished === false) {
      onLoaded();
      setIsFinished(true);
    }
    return <></>;
  }

  return (
    <Suspense fallback={<PolSpinner />}>
      {downloadOnly ? (
        <PDFDownloadLink document={children}>
          {({ blob, url, loading, error }) =>
            loading ? (
              <PolSpinner className="mx-auto" />
            ) : (
              <div className="grid">
                {setFinish()}
                <PolButton className="m-auto">Download</PolButton>
              </div>
            )
          }
        </PDFDownloadLink>
      ) : (
        <PDFViewer width={device.width / 2} height={device.height / 2}>
          {children}
        </PDFViewer>
      )}
    </Suspense>
  );
}
