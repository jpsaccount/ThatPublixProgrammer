import { LabelSection } from "@/components/LabelSection/LabelSection";
import { PolButton } from "@/components/polComponents/PolButton";
import PolText from "@/components/polComponents/PolText";
import { Card, CardContent } from "@/components/ui/card";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { BillableService } from "@/sdk/entities/billing/BillableService";
import { ChargeTable } from "@/sdk/entities/billing/ChargeTable";
import { User } from "@/sdk/entities/core/User";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import { useState } from "react";

export function BillableServiceItemInsideModal({
  billableService,
  addServiceItem,
}: {
  billableService: BillableService;
  addServiceItem: (itemId: string, chargeTableItemType: keyof ChargeTable) => void;
}) {
  const [isAdded, setIsAdded] = useState(false);
  const userRequest = useDbQueryFirst(User, `WHERE c.id = '${billableService.CreatedByUserId}'`);

  return (
    <Card key={billableService.id}>
      <CardContent className="mt-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <PolText type="bold">Billable Service</PolText>
          <PolText>{billableService.ServiceDate.format("MM-DD-YYYY")}</PolText>
        </div>
        <div className="flex justify-between">
          <LabelSection label="Title">
            <PolText>{billableService.Title}</PolText>
          </LabelSection>
          <LabelSection label="Description">
            <PolText>{billableService.Description}</PolText>
          </LabelSection>
          <LabelSection label="Employee">
            <PolText>{getFullName(userRequest.data?.Person)}</PolText>
          </LabelSection>
        </div>
        <PolButton
          className="w-full"
          onClick={() => {
            addServiceItem(billableService.id, "BillableServices");
            setIsAdded(true);
          }}
          disabled={isAdded}
        >
          {isAdded ? "Added" : "Add"}
        </PolButton>
      </CardContent>
    </Card>
  );
}
