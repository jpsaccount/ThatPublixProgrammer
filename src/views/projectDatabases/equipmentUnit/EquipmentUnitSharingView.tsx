import { PolButton } from "@/components/polComponents/PolButton";
import useDevice from "@/customHooks/useDevice";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { hasCameraAsync } from "@/utilities/deviceUtils";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import {
  CameraCaptureType,
  CameraType,
  NativeCameraRequest,
  NativeNfcRequest,
  NfcActionType,
  ReactNativeFeatureType,
  ReactNativeMediator,
} from "reactnativemediator";

interface props {
  projectDatabaseId: string;
  equipmentUnitId: string;
}

export default function EquipmentUnitSharingView({ projectDatabaseId, equipmentUnitId }: props) {
  const navigate = usePolNavigate();
  const device = useDevice();
  const [scanning, setScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [hasNativeCamera, setHasNativeCamera] = useState(false);
  const [hasNativeNfc, setHasNativeNfc] = useState(false);

  useEffect(() => {
    ReactNativeMediator.isFeatureAvailable(ReactNativeFeatureType.Camera).then((x) => setHasNativeCamera(x));
    ReactNativeMediator.isFeatureAvailable(ReactNativeFeatureType.NFC).then((x) => setHasNativeNfc(x));
    hasCameraAsync().then((hasCamera) => {
      setHasCamera(hasCamera);
      if (device.isMobile && hasCamera) {
        setScanning(true);
      }
    });
  }, []);

  const url = `${window.location.origin}/project-databases/${projectDatabaseId}/equipment-units/${equipmentUnitId}/tag`;
  useEffect(() => {
    if (hasNativeCamera === false) return;
    if (scanning === false) return;

    const request = new NativeCameraRequest();
    request.captureType = CameraCaptureType.QrCode;
    request.camera = CameraType.Back;
    ReactNativeMediator.requestAsync<string>(request).then((x) => {
      handleScan(x);
    });
  }, [scanning, hasNativeCamera]);

  const qrCodeReader = useRef(null);

  const handleScan = (data: any) => {
    console.log("data", data);
    if (data) {
      const urlObj = new URL(data);
      const path = urlObj.pathname;

      navigate({ to: path });
    }
    setScanning(false);
  };

  function WriteNfcAsync() {
    const request = new NativeNfcRequest();
    request.action = NfcActionType.Write;
    request.data = url;
    ReactNativeMediator.requestAsync(request);
  }

  return (
    <div className="m-auto grid h-[80dvh] w-auto grid-flow-row justify-center space-y-5 max-sm:w-screen ">
      {scanning && hasNativeCamera === false ? (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <QrScanner
              stopDecoding={!scanning}
              containerStyle={{ width: device.isMobile ? "100dvw" : "300px", height: "70dvh" }}
              scanDelay={300}
              onDecode={handleScan}
              onError={(err) => console.log(err)}
              constraints={{ facingMode: "environment" }}
              viewFinder={(...props) => {
                return <></>;
              }}
            />
          </motion.div>
          <PolButton className="m-auto p-5" onClick={() => setScanning(false)}>
            Stop
          </PolButton>
        </>
      ) : (
        <>
          <div className="spacing-2 m-2 my-auto grid space-y-5 rounded-lg bg-white p-5 dark:bg-gray-700">
            <QRCode value={url}></QRCode>
            {(hasCamera || hasNativeCamera) && <PolButton onClick={() => setScanning(true)}>Scan</PolButton>}
            {hasNativeNfc && <PolButton onClick={() => WriteNfcAsync()}>Write Nfc</PolButton>}
          </div>
        </>
      )}
    </div>
  );
}
