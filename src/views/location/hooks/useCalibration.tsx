import React, { useEffect, useState } from "react";
import {
  LocationData,
  NativeLocationRequest,
  LocationAccuracy,
  LocationInfoType,
  ReactNativeMediator,
} from "reactnativemediator";

export default function useCalibration(onSetTarget: (val: LocationData) => void) {
  const [best, setBest] = useState<LocationData | null>(null);
  const [endLocSub, setLocEndSub] = useState<() => void>(null);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibratingIsDone, setCalibratingIsDone] = useState(false);
  const [currentSample, setCurrentSample] = useState<LocationData | null>(null);
  const [progress, setProgress] = useState(0);

  const initValues = () => {
    setBest(null);
    setLocEndSub(null);
    setIsCalibrating(false);
    setCalibratingIsDone(false);
    setCurrentSample(null);
  };

  const startCalibration = () => {
    setIsCalibrating(true);
    const locationRequest = new NativeLocationRequest();

    locationRequest.accuracyType = LocationAccuracy.Best;
    locationRequest.type = LocationInfoType.Location;
    ReactNativeMediator.showLogs();
    const removeSub = ReactNativeMediator.subscribe<LocationData>(locationRequest, (data) => {
      setCurrentSample(data);
      console.log(data);
    });
    setLocEndSub(() => removeSub);
  };

  function runWithTimeout(callback: () => void, timeout: number): void {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      callback();
    }, timeout);
  }

  useEffect(() => {
    if (isCalibrating) {
      let progressInterval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(progressInterval);
            return 100;
          }
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 100);
        });
      }, 100);

      runWithTimeout(() => {
        endLocSub();
        setLocEndSub(null);
        setIsCalibrating(false);
        setCalibratingIsDone(true);
        clearInterval(progressInterval);
        setProgress(0);
      }, 5000);
    }
  }, [isCalibrating, endLocSub]);

  useEffect(() => {
    if (!calibratingIsDone) return;
    onSetTarget(best);
    initValues();
  }, [calibratingIsDone]);

  useEffect(() => {
    if (!currentSample) return;
    if (typeof currentSample !== "object" || currentSample === null) return;
    if (!("coords" in currentSample && "accuracy" in currentSample.coords)) return;

    if (!best) {
      setBest({ ...currentSample });
    } else {
      if (currentSample.coords.accuracy < best?.coords?.accuracy) {
        setBest(currentSample);
      }
    }
  }, [currentSample]);

  return { startCalibration, progress, isCalibrating };
}
