import CircleCheckBox from "@/components/polComponents/CircleCheckBox";
import PolText from "@/components/polComponents/PolText";
import { CheckListItem } from "@/sdk/childEntities/CheckListItem";
import React from "react";

interface Props {
  checkList: CheckListItem[];
}

export default function CheckListCardView({ checkList }: Props) {
  return (
    <div className="mt-2 flex flex-col items-start border-t pt-2">
      <span>
        {checkList.map((x) => (
          <span className="flex w-fit items-center gap-1">
            <CircleCheckBox isChecked={x.IsChecked}></CircleCheckBox>
            <PolText>{x.Title}</PolText>
          </span>
        ))}
      </span>
      <PolText type="muted" className="mb-1 ml-1 mt-2">
        {checkList.filter((x) => x.IsChecked).length} / {checkList.length}
      </PolText>
    </div>
  );
}
