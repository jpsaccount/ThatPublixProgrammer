import UpdateEntity from "@/components/crud/UpdateEntity";
import { PolButton } from "@/components/polComponents/PolButton";
import { PunchList } from "@/sdk/entities/punchList/PunchList";
import React from "react";

interface Props {
  punchList: PunchList;
}

export default function EditPunchList({ punchList }: Props) {
  return (
    <UpdateEntity
      trigger={
        <PolButton variant="outline" className="mb-2 w-96 font-sans text-lg hover:bg-white hover:shadow-md">
          {punchList.Title}
        </PolButton>
      }
      properties={[{ property: "Title" }, { property: "Description" }]}
      entityType={PunchList}
      entity={punchList}
    ></UpdateEntity>
  );
}
