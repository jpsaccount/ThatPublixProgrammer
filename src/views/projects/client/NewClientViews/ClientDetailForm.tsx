import React, { useState } from "react";
import { ClientFormProps } from "./ClientFormProps";
import PolInput from "@/components/polComponents/PolInput";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";

export default function ClientDetailForm({ client, updateClient }: ClientFormProps) {
  const [hasChangedDisplayName, setHasChangedDisplayName] = useState(false);
  return (
    <>
      <PolInput
        autoFocus
        data-testid="Company-Name-Input"
        type="text"
        label="Company Name"
        value={client.CompanyName}
        onValueChanged={(value) =>
          updateClient({ CompanyName: value, DisplayName: hasChangedDisplayName ? client.DisplayName : value })
        }
      />
      <PolInput
        type="text"
        data-testid="Display-Name-Input"
        label="Display Name"
        value={client.DisplayName}
        onValueChanged={(value) => {
          setHasChangedDisplayName(true);
          updateClient({ DisplayName: value });
        }}
      />
    </>
  );
}
