import diContainer, { tryAddToContainer } from "../sdkconfig/SdkSetup";

export function getService<T>(serviceType: new (...args: any[]) => T): T {
  const key = serviceType;
  tryAddToContainer(serviceType, key);

  return diContainer.get(key);
}
