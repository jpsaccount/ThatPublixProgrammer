import { PolButton } from "@/components/polComponents/PolButton";
import React, { useEffect, useState } from "react";
import {
  LocationAccuracy,
  LocationData,
  LocationInfoType,
  NativeLocationRequest,
  ReactNativeMediator,
} from "reactnativemediator";
import Guide from "./Guide";

const LocationTest = () => {
  const [target, setTarget] = useState<LocationData | null>(null);

  return (
    <div className="h-app grid grid-flow-row  p-4">
      {/* <LocationDirectionIndicator/> */}
      <Guide target={target} onSetTarget={setTarget}></Guide>
    </div>
  );
};

export default LocationTest;
