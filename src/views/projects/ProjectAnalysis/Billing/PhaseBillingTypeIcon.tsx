import PolIcon from "@/components/PolIcon";
import { PhaseBillingType } from "@/sdk/enums/PhaseBillingType";
import React, { useMemo } from "react";

interface Props {
  phaseBillingType: PhaseBillingType;
  className: string;
}

export default function PhaseBillingTypeIcon({ phaseBillingType, className }: Props) {
  const iconType = useMemo(() => {
    let iconName = "CircleAlert";
    if (phaseBillingType === PhaseBillingType.Expenses) {
      iconName = "Receipt";
    } else if (phaseBillingType === PhaseBillingType.LumpSum) {
      iconName = "Wallet";
    } else if (phaseBillingType === PhaseBillingType.TimeAndMaterials) {
      iconName = "CalendarPlus";
    } else if (phaseBillingType === PhaseBillingType.NotBillable) {
      iconName = "CircleOff";
    } else if (phaseBillingType === PhaseBillingType.TBD) {
      iconName = "CircleAlert";
    }
    return iconName;
  }, [phaseBillingType]);
  const hint = useMemo(() => {
    let hintText = "Unknown phase type";
    if (phaseBillingType === PhaseBillingType.Expenses) {
      hintText = "Expenses Billing Type";
    } else if (phaseBillingType === PhaseBillingType.LumpSum) {
      hintText = "Lumpsum Billing Type";
    } else if (phaseBillingType === PhaseBillingType.TimeAndMaterials) {
      hintText = "Time and Materials Billing Type";
    } else if (phaseBillingType === PhaseBillingType.NotBillable) {
      hintText = "Not BIllable Billing Type";
    } else if (phaseBillingType === PhaseBillingType.TBD) {
      hintText = "TBD Billing Type";
    }
    return hintText;
  }, [phaseBillingType]);
  return <PolIcon name={iconType} hintText={hint} className={className} />;
}
