import { PolButton } from "@/components/polComponents/PolButton";
import PolHeading from "@/components/polComponents/PolHeading";
import { Card } from "flowbite-react";
import { ArrowUp, Wifi } from "lucide-react";
import { set } from "node_modules/cypress/types/lodash";
import React, { useEffect, useMemo, useState } from "react";
import {
  LocationAccuracy,
  LocationData,
  NativeLocationRequest,
  LocationInfoType,
  ReactNativeMediator,
} from "reactnativemediator";
import useCalibration from "./hooks/useCalibration";
import { LinearProgress } from "@mui/material";
import { useMotionValue, useSpring } from "framer-motion";

interface Props {
  target: LocationData;
  onSetTarget: (val: LocationData) => void;
}

const Guide = ({ target, onSetTarget }: Props) => {
  const { startCalibration, progress, isCalibrating } = useCalibration(onSetTarget);

  const [position, setPosition] = useState<LocationData | null>(null);
  const [heading, setHeading] = useState<number>(0);
  const [endLocSub, setLocEndSub] = useState<() => void>(null);
  const [endDirSub, setEndDirSub] = useState<() => void>(null);

  const startSub = () => {
    const locationRequest = new NativeLocationRequest();

    locationRequest.accuracyType = LocationAccuracy.Best;
    locationRequest.type = LocationInfoType.Location;
    ReactNativeMediator.showLogs();
    const removeSub = ReactNativeMediator.subscribe<LocationData>(locationRequest, (data) => {
      setPosition(data);
    });

    const directionRequest = new NativeLocationRequest();

    directionRequest.type = LocationInfoType.Direction;

    const removeDirSub = ReactNativeMediator.subscribe(directionRequest, (data: any) => {
      setHeading(data.trueHeading);
    });
    setEndDirSub(() => removeDirSub);
    setLocEndSub(() => removeSub);
  };

  function calculateDirection(currentX: number, currentY: number, targetX: number, targetY: number): number {
    // Calculate the differences between target and current positions
    const dx: number = targetX - currentX;
    const dy: number = targetY - currentY;

    // Calculate the angle in radians using arctangent function
    let angle: number = Math.atan2(dy, dx);

    // Convert radians to degrees
    angle = angle * (180 / Math.PI);

    // Ensure angle is positive
    if (angle < 0) {
      angle += 360;
    }

    return angle;
  }

  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c;
    return d;
  }

  const interpolateOpacity = (directionToTarget: number) => {
    let highestOpacity = 0.95;
    if (directionToTarget >= 300 && directionToTarget <= 360) {
      return ((directionToTarget - 300) / 60) * highestOpacity;
    } else if (directionToTarget >= 0 && directionToTarget <= 60) {
      return highestOpacity - ((directionToTarget - 0) / 60) * highestOpacity;
    } else {
      return 0;
    }
  };

  const [bearing, setBearing] = useState(0);

  const directionToTarget = useMemo(() => {
    if (target && position && position.coords && position.coords.latitude && position.coords.longitude) {
      let trueBearing = calculateDirection(
        position.coords.latitude,
        position.coords.longitude,
        target.coords.latitude,
        target.coords.longitude,
      );
      setBearing(trueBearing);

      let relativeAngle = trueBearing - heading;

      relativeAngle = (relativeAngle + 360) % 360;

      return relativeAngle;
    }
  }, [position, target, heading]);

  const feetConversion = 3.28084;
  const distanceToTarget = useMemo(() => {
    if (target && position && position.coords && position.coords.latitude && position.coords.longitude) {
      let distance = calculateDistance(
        target.coords.latitude,
        target.coords.longitude,
        position.coords.latitude,
        position.coords.longitude,
      );

      return distance * feetConversion;
    }
  }, [position, target]);

  const greenOpacity = useMemo(() => {
    if (directionToTarget) {
      return interpolateOpacity(directionToTarget);
    }
    return 0;
  }, [directionToTarget]);

  const endSubs = () => {
    endLocSub();
    endDirSub();
    setLocEndSub(null);
    setEndDirSub(null);
  };

  return (
    <>
      {endLocSub && endDirSub ? (
        <div className="grid grid-flow-row ">
          <div className=" stackGrid justify-center">
            <div className="  left-1/2 top-1/3 h-[300px] w-[300px] transform items-center justify-center rounded-full  border bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <div className="h-30 rounded-b-5 absolute top-0 w-3 bg-white bg-opacity-20"></div>
              <div
                style={{
                  transform: `rotate(${directionToTarget}deg)`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Wifi size={290} />
              </div>
            </div>
            <div className=" left-1/2 top-1/3 h-[300px] w-[300px] transform items-center justify-center rounded-full ">
              <div
                className="h-30 top-0 w-3"
                style={{
                  backgroundColor: `rgba(74, 222, 128, ${greenOpacity})`,
                }}
              ></div>
              <div
                style={{
                  transform: `rotate(${directionToTarget}deg)`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Wifi size={290} color={`rgba(74,222,128, ${greenOpacity})`} />
              </div>
            </div>
          </div>
          <Card>
            <PolButton onClick={startCalibration}>Start Calibration</PolButton>
            {isCalibrating && <LinearProgress variant="determinate" value={progress} />}
          </Card>
          <Card>
            <div className="grid grid-flow-row">
              <p className="">Distance: {distanceToTarget?.toFixed(0)} feet</p>
              <div className="flex flex-col items-center border ">
                <PolHeading size={3}>Target Info</PolHeading>
                <p className="">Longitude: {target.coords?.longitude?.toFixed(10)}</p>
                <p className="">Latitude: {target.coords?.latitude?.toFixed(10)}</p>
                <p className="">Altitude: {target.coords?.altitude?.toFixed(10)}</p>
                <p className="">
                  Altitude Accuracy: {(target?.coords?.altitudeAccuracy * feetConversion)?.toFixed(0)} FARs
                </p>
                <p className="">Accuracy: {(target?.coords?.accuracy * feetConversion).toFixed(0)} FARs</p>
              </div>
              <div className="flex flex-col items-center  border ">
                <PolHeading size={3}>Current Info</PolHeading>
                <p className="">Longitude: {position?.coords?.longitude?.toFixed(10)}</p>
                <p className="">Latitude: {position?.coords?.latitude?.toFixed(10)}</p>
                <p className="">Altitude: {position?.coords?.altitude?.toFixed(10)}</p>
                <p className="">
                  Altitude Accuracy: {(position?.coords?.altitudeAccuracy * feetConversion)?.toFixed(0)} FARs
                </p>
                <p className="">Accuracy: {(position?.coords?.accuracy * feetConversion).toFixed(0)} FARs</p>
              </div>
              <PolButton onClick={endSubs}>Stop</PolButton>
            </div>
          </Card>
        </div>
      ) : (
        <>
          <Card>
            <PolButton onClick={startCalibration}>Start Calibration</PolButton>
            {isCalibrating && <LinearProgress variant="determinate" value={progress} />}
          </Card>
          <Card>
            <PolButton disabled={target === null} onClick={startSub}>
              Find Fixture
            </PolButton>
          </Card>
        </>
      )}
    </>
  );
};

export default Guide;
