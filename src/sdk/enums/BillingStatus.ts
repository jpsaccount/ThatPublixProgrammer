export enum BillingStatus {
  Unknown,
  NotBillable,
  Billable,
  AddedToInvoice,
  HasBeenBilled,
  BilledElsewhere = 6,
  LumpSum = 7,
}
