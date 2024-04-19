export function isIphone(): boolean {
  return /iPhone/.test(navigator.userAgent);
}

export function isPwaLaunched() {
  // For iOS devices
  if ((window.navigator as any).standalone) {
    return true;
  }
  // For Android and other devices
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return true;
  }
  // Default return for browser
  return false;
}

export async function hasCameraAsync(): Promise<boolean> {
  try {
    const devices = await navigator.mediaDevices?.enumerateDevices();
    return devices?.some((device) => device.kind === "videoinput") ?? false;
  } catch (error) {
    console.error("Error checking for camera:", error);
    return false;
  }
}
