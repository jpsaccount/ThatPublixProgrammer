import PolHeading from "@/components/polComponents/PolHeading";
import React from "react";
import { ClientFormProps } from "./ClientFormProps";

export default function ClientSummaryForm({ client }: ClientFormProps) {
  return <PolHeading size={2}>{client.CompanyName}</PolHeading>;
}
