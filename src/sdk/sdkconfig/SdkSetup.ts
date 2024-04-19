import { LocalStorageService } from "../services/LocalStorageService";
import { Container } from "inversify";

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

export function setupSdk() {
  if (alreadySetupSdk) return;
  alreadySetupSdk = true;

  tryAddToContainer(LocalStorageService);
}

export default diContainer;
