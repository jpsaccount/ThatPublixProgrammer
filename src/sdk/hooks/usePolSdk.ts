import { useAuth } from "@/customHooks/auth";
import React, { useEffect } from "react";
import { SdkHeartbeatHandler } from "../services/SdkHeartbeatHandler";
import { getService } from "../services/serviceProvider";

export default function usePolSdk() {
  const auth = useAuth();
  useEffect(() => {
    const heartbeatHandler = getService(SdkHeartbeatHandler);
    if (auth.identity) {
      heartbeatHandler.InitAsync(auth.identity);
      console.log("starting heart beat", auth.identity);
    } else {
      heartbeatHandler.quitAsync();
    }

    () => heartbeatHandler.quitAsync();
  }, [auth.identity?.uid]);
}
