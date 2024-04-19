import { Entity } from "../../contracts/Entity";
import { PhaseBillingType } from "../../enums/PhaseBillingType";
import { RoleRateById } from "./RoleRateById";
import { EntityType } from "../../sdkconfig/EntityTypeId";
import { Moment } from "moment/moment";

@EntityType("6c7850a4-fe3e-498d-b789-d31390b677d5")
export class WorkingPhase extends Entity {
  DisplayName: string = "";
  Title: string = "";
  Description: string = "";
  CurrencyId: string = "";
  PhaseActivityBucketId: string = "";
  InheritanceId: string = "";
  ShowInTimesheet: boolean = false;
  StartDate?: Moment;
  EndDate?: Moment;
  DocumentedDate: Moment;
  ProjectId: string = "";
  ProposalPhaseId: string = "";
  DirectivePhaseId: string = "";
  ContractPhaseId: string = "";
  IsBasedOnContract: boolean = false;
  PhaseBillingType: PhaseBillingType;
  AmountAllotted: number = 0;
  AvailableAmountLeft: number = 0;
  AmountUsed: number = 0;
  AmountPendingBilling: number = 0;
  AmountBilled: number = 0;
  TotalCost: number = 0;
  AmountCacheFrom: Moment;
  Status: any;
  EstimatedHours: number = 0;
  CategoryId: string = "";
  Notes: string = "";
  RoleRates: RoleRateById[] = [];

  constructor() {
    super();
  }
}
