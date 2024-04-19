import { injectable } from "inversify";

@injectable()
export class SdkOptions {
  constructor() {}
  ServerPath: string = "";
}
