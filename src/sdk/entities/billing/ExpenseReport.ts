import { Entity } from "../../contracts/Entity";
import { ExpenseReportStatusEnum } from "../../enums/ExpenseReportStatusEnum";
import { EntityType } from "../../sdkconfig/EntityTypeId";
import { Moment } from "moment/moment";

@EntityType("d1c221b8-1113-4593-8c1c-985cfc50eccc")
export class ExpenseReport extends Entity {
  ReimbursedAmountUsd: number;
  ApprovedExpensesCount: number;
  CertifiedDateTime: Moment;
  PendingAmountUsd: number;
  ApprovedAmountUsd: number;
  Status: ExpenseReportStatusEnum;
  TotalAmountUsd: number;
  TotalExpensesCount: number;
  Notes: string = "";
  GlobalExpenseReportId: string = "";
  UserId: string = "";
}
