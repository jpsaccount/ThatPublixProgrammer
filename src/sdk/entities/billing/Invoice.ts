import { InvoicePdfSettings } from "@/sdk/childEntities/InvoicePdfSettings";
import { InvoiceSummaryTable } from "../../childEntities/InvoiceSummaryTable";
import { Entity } from "../../contracts/Entity";
import { InvoiceStatus } from "../../enums/InvoiceStatus";
import { EntityType } from "../../sdkconfig/EntityTypeId";
import { ChargeTable } from "./ChargeTable";
import moment, { Moment } from "moment/moment";

@EntityType("a7981476-5e6e-49aa-8873-afd2477c86ad")
export class Invoice extends Entity {
  ProjectId: string = "";
  AmountPaid: number;
  ChangeOrderNumber: string = "";
  ContractNumber: string = "";
  DatePaid: Moment = moment();
  DueDate: Moment = moment();
  InternalName: string = "";
  InvoiceNumber: string = "";
  InvoiceTotal: number;
  Memo: string = "";
  Status: InvoiceStatus;
  Subtotal: number;
  SummaryTable: InvoiceSummaryTable = new InvoiceSummaryTable();
  ChargeTables: ChargeTable[] = [];
  TermId: string = "";
  InvoiceDate: Moment = moment();
  PdfSettings: InvoicePdfSettings = new InvoicePdfSettings();
}
