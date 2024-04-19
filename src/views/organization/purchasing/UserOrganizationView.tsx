import { useState } from "react";
import OrganizationPlanPreview from "./OrganizationPlanPreview";
import OrganizationPurchasingView from "./OrganizationPurchasingView";

export default function UserOrganizationView() {
  const [wantsToPurchase, setWantsToPuchase] = useState(false);
  console.log("wants to purchase", wantsToPurchase);
  if (wantsToPurchase) {
    return <OrganizationPurchasingView goBack={() => setWantsToPuchase(false)} />;
  }
  return <OrganizationPlanPreview onGetStarted={() => setWantsToPuchase(true)}></OrganizationPlanPreview>;
}
