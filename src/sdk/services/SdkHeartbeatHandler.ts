import * as signalR from "@microsoft/signalr";
import { User } from "firebase/auth";
import { inject, injectable } from "inversify";
import { DatabaseStateChange } from "../models/ObjectSyncedResponse";
import { SdkOptions } from "../models/SdkOptions";
import { getCallerUniqueKey } from "../utils/metaProgrammingUtils";
import { isUsable } from "../utils/usabilityUtils";
import { StateHandler } from "./StateHandler";

@injectable()
export class SdkHeartbeatHandler {
  private _sdkOptions: SdkOptions;
  private _stateHandler: StateHandler;

  constructor(@inject(SdkOptions) sdkOptions: SdkOptions, @inject(StateHandler) stateHandler: StateHandler) {
    this._sdkOptions = sdkOptions;
    this._stateHandler = stateHandler;
  }

  hubConnection: signalR.HubConnection;

  async InitAsync(authResult: User) {
    const url = this._sdkOptions.ServerPath + "live-changes";
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl(url, {
        accessTokenFactory: () => authResult.getIdToken(true),
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on("sdkHeartbeat", (databaseStateChanges: Array<DatabaseStateChange>) => {
      if (Array.isArray(databaseStateChanges) == false) return;
      for (const action of actions.values()) {
        action(databaseStateChanges);
      }
    });
    console.log("Connection starting...");
    this.hubConnection
      .start()
      .then(() => {
        console.log("Connection started");
      })
      .catch((err) => {
        console.error("Error starting connection: " + err);
      });
    this.hubConnection.onclose((error) => {
      if (error) {
        console.error("Connection closed with error: " + error);
      } else {
        console.log("Connection closed");
      }
      this.InitAsync(authResult);
    });
  }

  async quitAsync() {
    if (isUsable(this.hubConnection) == false) return;

    await this.hubConnection.stop();
  }
}

const actions = new Map<string, (action: Array<DatabaseStateChange>) => Promise<void> | void>();

export function onLiveUpdates(action: (updates: Array<DatabaseStateChange>) => Promise<void> | void, key?: string) {
  key ??= getCallerUniqueKey();
  actions.set(key, action);
}
