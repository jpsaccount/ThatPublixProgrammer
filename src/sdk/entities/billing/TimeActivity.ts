import moment from "moment/moment";
import { Entity } from "../../contracts/Entity";
import { EntityType } from "../../sdkconfig/EntityTypeId";
import { BillingDetails } from "./BillingDetails";
import { Moment } from "moment/moment";

@EntityType("2edb43a3-dfe7-4957-a78d-19028e92586a")
export class TimeActivity extends Entity {
  ActivityDate: Moment = moment(new Date());
  BillableRate: number;
  Description: string = "";
  CertifiedDateTime: Moment = moment(new Date());
  HasRequestBillableChange: boolean;
  HasRequestVerification: boolean;
  Hours: number;
  UseRoleBillableRate: boolean;
  UserNotes: string = "";
  AdminNotes: string = "";
  OverrideDefaultStatus: boolean;
  UserId: string = "";
  ClientId: string = "";
  ProjectId: string = "";
  WorkingPhaseId: string = "";
  RoleId: string = "";
  TaskId: string = "";
  SubTaskId: string = "";
  UserTimesheetId: string = "";
  BillingDetails: BillingDetails = new BillingDetails();
}
