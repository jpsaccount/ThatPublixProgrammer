import { ChildEntity } from "../../contracts/ChildEntity";
import { PhaseBillingType } from "../../enums/PhaseBillingType";
import { Moment } from "moment/moment";

export class DocumentLineItem extends ChildEntity {
  Title: string = "";
  Description: string = "";
  CurrencyId: string = "";
  AmountAllotted: number;
  Notes: string = "";
  PhaseBillingType: PhaseBillingType; // Enum or class, assumed to be imported
  StartDate?: Moment;
  EndDate?: Moment;
  PhaseActivityBucketId: string = "";
  IsAdjustmentPhase: boolean;
  WorkingPhaseId: string = "";
  IsActive: boolean;
}
