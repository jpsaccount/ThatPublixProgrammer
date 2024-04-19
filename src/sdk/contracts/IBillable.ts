import { IEntity } from "..";
import { BillingDetails } from "../entities/billing/BillingDetails";
export interface IBillable extends IEntity {
  BillingDetails: BillingDetails;
  WorkingPhaseId: string;
  AmountUsd: number;
}
