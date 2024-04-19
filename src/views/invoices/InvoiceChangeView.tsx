import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { Invoice } from "@/sdk/entities/billing/Invoice";
import { ChangeEvent } from "@/sdk/entities/core/ChangeEvent";
import { getEntityTypeId } from "@/sdk/sdkconfig/EntityTypeId";
import React from "react";

export default function InvoiceChangeView({ invoice }: { invoice: Invoice }) {
  const changesRequest = useDbQuery(
    ChangeEvent,
    `WHERE c.EntityData.TypeId = "${getEntityTypeId(Invoice)}" AND c.EntityData.EntityId = "${invoice.id}"`,
  );
  return <div></div>;
}
