import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { hasCameraAsync } from "@/utilities/deviceUtils";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { useEffect, useState } from "react";
import {
  CameraCaptureType,
  CameraType,
  NativeCameraRequest,
  ReactNativeFeatureType,
  ReactNativeMediator,
} from "reactnativemediator";

interface Props {
  isOpen: boolean;
  onOpenChange: (value: boolean) => any;
  onSuccess: (text: string) => void;
}

export default function Scanner({ isOpen, onOpenChange, onSuccess }: Props) {
  const [hasCamera, setHasCamera] = useState(false);
  const [hasNativeCamera, setHasNativeCamera] = useState(false);

  useEffect(() => {
    ReactNativeMediator.isFeatureAvailable(ReactNativeFeatureType.Camera).then((x) => setHasNativeCamera(x));
    hasCameraAsync().then((hasCamera) => setHasCamera(hasCamera));
  }, []);

  useEffect(() => {
    if (hasNativeCamera === false) return;
    if (isOpen === false) return;

    const request = new NativeCameraRequest();
    request.captureType = CameraCaptureType.QrCode;
    request.camera = CameraType.Back;
    ReactNativeMediator.requestAsync<string>(request).then((x) => {
      handleScan(x);
    });
  }, [isOpen, hasNativeCamera]);

  const handleScan = (data: any) => {
    if (data) {
      onSuccess && onSuccess(data);
    }
    onOpenChange(false);
  };
  return (
    hasNativeCamera === false &&
    hasCamera && (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Scanner</DrawerTitle>
          </DrawerHeader>
          <QrScanner
            stopDecoding={!isOpen}
            containerStyle={{ width: "100dvw", height: "70dvh" }}
            scanDelay={300}
            onDecode={handleScan}
            onError={(err) => console.log(err)}
            constraints={{ facingMode: "environment" }}
            viewFinder={(...props) => {
              console.log(props);
              return <></>;
            }}
          />
          <DrawerFooter>
            <DrawerClose>Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  );
}
