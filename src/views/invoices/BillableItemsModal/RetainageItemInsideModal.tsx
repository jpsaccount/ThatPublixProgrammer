import { LabelSection } from "@/components/LabelSection/LabelSection";
import { PolButton } from "@/components/polComponents/PolButton";
import PolText from "@/components/polComponents/PolText";
import { Card, CardContent } from "@/components/ui/card";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { ChargeTable } from "@/sdk/entities/billing/ChargeTable";
import { RetainageItem } from "@/sdk/entities/billing/RetainageItems";
import { User } from "@/sdk/entities/core/User";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import { useState } from "react";

export function RetainageItemInsideModal({
  retainageItem,
  addRetainageItem,
}: {
  retainageItem: RetainageItem;
  addRetainageItem: (itemId: string, chargeTableItemType: keyof ChargeTable) => void;
}) {
  const [isAdded, setIsAdded] = useState(false);
  const userRequest = useDbQueryFirst(User, `WHERE c.id = '${retainageItem.CreatedByUserId}'`);

  return (
    <Card key={retainageItem.id}>
      <CardContent className="mt-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <PolText type="bold">Retainage Item</PolText>
          <PolText>{retainageItem.CreatedDateTime.format("MM-DD-YYYY")}</PolText>
        </div>
        <div className="flex justify-between">
          <LabelSection label="Title">
            <PolText>{retainageItem.Title}</PolText>
          </LabelSection>
          <LabelSection label="Description">
            <PolText>{retainageItem.Description}</PolText>
          </LabelSection>
          <LabelSection label="Employee">
            <PolText>{getFullName(userRequest.data?.Person)}</PolText>
          </LabelSection>
        </div>
        <PolButton
          className="w-full"
          onClick={() => {
            addRetainageItem(retainageItem.id, "RetainageItems");
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
