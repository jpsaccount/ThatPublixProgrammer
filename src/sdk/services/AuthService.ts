import { AxiosError } from "axios";
import {
  User,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { inject, injectable } from "inversify";
import { RequestResponse } from "../models/RequestResponse";
import { getCallerUniqueKey } from "../utils/metaProgrammingUtils";
import { isUsable } from "../utils/usabilityUtils";
import { HttpRequestHandler, addDefaultSdkHeader, onSdkRequestErrors } from "./Http/HttpRequestHandler";
import { LocalStorageService } from "./LocalStorageService";

@injectable()
export class AuthService {
  private httpRequestHandler: HttpRequestHandler;
  @inject(LocalStorageService) private localStorageService: LocalStorageService;

  Auth: User;

  public constructor(
    @inject(HttpRequestHandler) http: HttpRequestHandler,
    @inject(LocalStorageService) localStorageService: LocalStorageService,
  ) {
    this.localStorageService = localStorageService;
    this.httpRequestHandler = http;
  }

  async initAsync(): Promise<boolean> {
    const auth = getAuth();
    await auth.authStateReady();
    let authFound = false;
    if (auth.currentUser) {
      authFound = true;
      await this.onAuthAsync(auth.currentUser);
    } else {
      await this.onAuthFailedAsync();
    }
    onSdkRequestErrors(async (error) => {
      if (error instanceof AxiosError) {
        const wasUnauthorizedError = error.response?.status == 401;
        if (wasUnauthorizedError && isUsable(this.Auth)) {
          addDefaultSdkHeader("Authorization", "Bearer " + (await this.Auth.getIdToken(true)));
          return true;
        }
      }
      return false;
    });
    return authFound;
  }

  async signOutAsync(): Promise<void> {
    this.isLoggedIn = false;
    const auth = getAuth();
    await auth.signOut();
    this.Auth = null;
    addDefaultSdkHeader("Authorization", undefined);
    const callbacks = Array.from(onSignOutAsyncCallbacks.values()).map((callback) => callback());
    await Promise.all(callbacks);
  }

  private async onAuthFailedAsync() {
    const callbacks = Array.from(onAuthFailedCallbacks.values()).map((callback) => callback());
    await Promise.all(callbacks);
  }

  async registerAsync(
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    password: string,
  ): Promise<RequestResponse<User>> {
    const auth = getAuth();
    try {
      let user = auth.currentUser;
      if (auth.currentUser?.email !== email) {
        await setPersistence(auth, browserLocalPersistence);
        user = (await createUserWithEmailAndPassword(auth, email, password)).user;
      }

      await this.httpRequestHandler.postAsync(`auth/register`, {
        Email: email,
        IdentityId: user.uid,
        FirstName: firstName,
        LastName: lastName,
        PhoneNumber: phoneNumber,
      });

      this.isLoggedIn = false;

      await this.onAuthAsync(user);
      var response = new RequestResponse<User>();
      response.data = user;
      return response;
    } catch (error) {
      const result = new RequestResponse<User>();
      result.error = error;
      return result;
    }
  }

  async signInAsync(email: string, password: string): Promise<RequestResponse<User>> {
    const auth = getAuth();
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithEmailAndPassword(auth, email, password);
      this.isLoggedIn = false;

      await this.onAuthAsync(result.user);
      var response = new RequestResponse<User>();
      response.data = result.user;
      return response;
    } catch (error) {
      console.log(error);
      const result = new RequestResponse<User>();
      result.error = error;
      if (error.message === "Firebase: Error (auth/invalid-email).") {
        error.message = "Your email or password was incorrect.";
      }
      if (error.message === "Firebase: Error (auth/invalid-credential).") {
        error.message = "Your email or password was incorrect.";
      }
      return result;
    }
  }

  isLoggedIn: boolean;
  private async onAuthAsync(response: User) {
    if (this.isLoggedIn) return;

    this.isLoggedIn = true;
    this.Auth = response;
    addDefaultSdkHeader("Authorization", "Bearer " + (await response.getIdToken()));
    const callbacks = Array.from(onAuthAsyncCallbacks.values());

    try {
      await Promise.all(
        callbacks.map(async (callback) => {
          await callback(response);
        }),
      );
    } catch (error) {
      // Handle overall error
    }
  }
}

const onSignOutAsyncCallbacks = new Map<string, () => Promise<void> | void>();
const onAuthAsyncCallbacks = new Map<string, (response: User) => Promise<void> | void>();

export function onSignOut(callback: () => Promise<void> | void) {
  const key = getCallerUniqueKey();
  onSignOutAsyncCallbacks.set(key, callback);
}

export function onAuth(callback: (response: User) => Promise<void> | void) {
  const key = getCallerUniqueKey();
  onAuthAsyncCallbacks.set(key, callback);
}

const onAuthFailedCallbacks = new Map<string, () => Promise<void> | void>();

export function onAuthFailed(callback: () => Promise<void> | void) {
  const key = getCallerUniqueKey();
  onAuthFailedCallbacks.set(key, callback);
}
