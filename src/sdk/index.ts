import "reflect-metadata";
import { SdkOptions } from "./models/SdkOptions";
import { setupSdk } from "./sdkconfig/SdkSetup";
import { onAuth, onAuthFailed } from "./services/AuthService";
import { addDefaultSdkHeader } from "./services/Http/HttpRequestHandler";
import { LocalStorageService } from "./services/LocalStorageService";
import { SdkHeartbeatHandler } from "./services/SdkHeartbeatHandler";
import { getService } from "./services/serviceProvider";
import { isDev } from "./utils/devUtils";
import { newUuid } from "./utils/uuidUtils";
import { loadStripe } from "@stripe/stripe-js";
import { initializeApp } from "firebase/app";

export type { IEntity } from "./contracts/IEntity";
export { Address } from "./models/Address";
export type { AuthenticationResponse } from "./models/AuthenticationResponse";
export { MFAAuthenticationType } from "./models/AuthenticationType";
export { EmployeeStatus } from "./models/EmployeeStatus";
export { Name } from "./models/Name";
export { Person } from "./models/Person";
export { RequestResponse } from "./models/RequestResponse";
export { AuthService } from "./services/AuthService";
export { LocalStorageService } from "./services/LocalStorageService";

let isSetupYet: boolean = false;
export const CurrentSessionId = crypto.randomUUID ? crypto.randomUUID() : newUuid();

export function setup() {
  if (isSetupYet) return;
  isSetupYet = true;

  import("react-pdf").then((x) => {
    x.pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.js", import.meta.url).toString();
  });

  try {
    const firebaseConfig = {
      apiKey: "AIzaSyCXSKmFatGtrSwHs7Q2Tvf6vzgjVM3AAfE",
      authDomain: "portal-one-5b3c3.firebaseapp.com",
      projectId: "portal-one-5b3c3",
      storageBucket: "portal-one-5b3c3.appspot.com",
      messagingSenderId: "905506411949",
      appId: "1:905506411949:web:992e02b24085a3f62d3d24",
      measurementId: "G-YEGY47VTZW",
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
  } catch (error) {
    console.log(error);
  }

  const isTestEnvironment = isDev();

  const options = new SdkOptions();
  if (isTestEnvironment) {
    options.ServerPath = "https://localhost:5001/";
  } else {
    options.ServerPath = "https://polapi2.azurewebsites.net/";
  }
  setupSdk(options);
  const localStorage = getService(LocalStorageService);
  let deviceId = localStorage.getItem<string>("X-Client-Device-Identifier");
  if (deviceId === null) {
    deviceId = crypto.randomUUID ? crypto.randomUUID() : newUuid();
  }
  if (isTestEnvironment && false) {
    deviceId = "93735664-945a-461b-a148-cb70dabd0051";
  }

  localStorage.setItem("X-Client-Device-Identifier", deviceId);
  addDefaultSdkHeader("X-Client-Device-Identifier", deviceId);
  addDefaultSdkHeader("X-Session-Id", CurrentSessionId);
  // Setting this header will ensure the update api calls will return a full entity rather than a delta
  // addDefaultSdkHeader("X-Full-Entity-Response", "6fb24610-ad07-44d4-9ead-f3108503a16b");
}
