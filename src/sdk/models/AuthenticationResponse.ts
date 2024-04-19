import { User } from "../entities/core/User";
import { MFAAuthenticationType } from "./AuthenticationType";
import { Moment } from "moment";

export class AuthenticationResponse {
  TenantExist: boolean;
  LoginSuccessful: boolean;
  NeedsMFA: boolean;
  ShouldConfirmEmail: boolean;
  ShouldConfirmPhoneNumber: boolean;
  MFAContextId: string;
  CensoredMFAResource: string;
  MfaAuthenticationType: MFAAuthenticationType;
  AuthenticationToken: string;
  RefreshToken: string;
  UserId: string;
  AccessTokenValidTo: Moment;
  RefreshTokenValidTo: Moment;
  User: User;
  Reason: string;
}
