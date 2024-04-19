import { BillingStatus } from "../enums/BillingStatus";

export function isBillable(status: BillingStatus): boolean {
  return (
    status === BillingStatus.Billable ||
    status === BillingStatus.AddedToInvoice ||
    status === BillingStatus.HasBeenBilled ||
    status === BillingStatus.BilledElsewhere
  );
}

export function isOnInvoice(status: BillingStatus): boolean {
  return (
    status === BillingStatus.AddedToInvoice ||
    status === BillingStatus.HasBeenBilled ||
    status === BillingStatus.BilledElsewhere
  );
}

export function isBilled(status: BillingStatus): boolean {
  return status === BillingStatus.HasBeenBilled || status === BillingStatus.BilledElsewhere;
}

export function isLumpSum(status: BillingStatus): boolean {
  return status === BillingStatus.LumpSum;
}
