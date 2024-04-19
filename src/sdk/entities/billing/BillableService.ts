import moment from "moment/moment";
import { Entity } from "../../contracts/Entity";
import { IBillable as IBillable } from "../../contracts/IBillable";
import { EntityType } from "../../sdkconfig/EntityTypeId";
import { BillingDetails } from "./BillingDetails";
import { Moment } from "moment/moment";

@EntityType("6796deb6-3e13-43bf-9eb8-31727c960731")
export class BillableService extends Entity implements IBillable {
  AmountUsd: number;
  Description: string = "";
  Quantity: number;
  Rate: number;
  ServiceDate: Moment = moment();
  Title: string = "";
  WorkingPhaseId: string = "";
  BillingDetails: BillingDetails;
}
