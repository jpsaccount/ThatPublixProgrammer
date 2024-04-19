import { SdkOptions } from "../models/SdkOptions";
import { LocalStorageService } from "../services/LocalStorageService";
import { HttpMessageHandler } from "../services/Http/HttpMessageHandler";
import { Container } from "inversify";
import { HttpRequestHandler } from "../services/Http/HttpRequestHandler";

import { StateHandler } from "../services/StateHandler";
import { AuthService } from "../services/AuthService";

let alreadySetupSdk = false;

const diContainer = new Container();

export function tryAddToContainer<T>(serviceType: new (...args: any[]) => T, key?: any | undefined): boolean {
  if (key === undefined) {
    key = serviceType;
  }

  if (!diContainer.isBound(key)) {
    diContainer.bind<T>(key).to(serviceType).inSingletonScope();
    return true;
  }
  return false;
}

export function setupSdk(sdkOptions?: SdkOptions) {
  if (alreadySetupSdk) return;
  alreadySetupSdk = true;

  diContainer.bind<SdkOptions>(SdkOptions).toConstantValue(sdkOptions);
  tryAddToContainer(StateHandler);
  tryAddToContainer(HttpMessageHandler);
  tryAddToContainer(HttpRequestHandler);
  tryAddToContainer(AuthService);
  tryAddToContainer(LocalStorageService);
}

export default diContainer;
