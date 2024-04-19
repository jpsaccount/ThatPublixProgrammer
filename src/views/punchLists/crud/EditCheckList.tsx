import CircleCheckBox from "@/components/polComponents/CircleCheckBox";
import PolCheckbox from "@/components/polComponents/PolCheckbox";
import PolText from "@/components/polComponents/PolText";
import { CheckListItem } from "@/sdk/childEntities/CheckListItem";
import { LinearProgress } from "@mui/material";
import { X } from "lucide-react";
import React, { useMemo } from "react";

interface Props {
  checklist: CheckListItem[];
  onChange: (checklist: CheckListItem[]) => void;
  showOnCard: boolean;
  onShowOnCardChange: (showOnCard: boolean) => void;
}

export default function EditCheckList({ checklist, onChange, showOnCard, onShowOnCardChange }: Props) {
  const [newItem, setNewItem] = React.useState<string>("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newItem = new CheckListItem();
      newItem.Title = e.currentTarget.value;
      newItem.IsChecked = false;
      onChange([...checklist, newItem]);
      setNewItem("");
    }
  };

  const onItemChange = (id: string, isChecked: boolean, title: string) => {
    const newCheckList = checklist.map((item) => {
      if (item.Id === id) {
        return { ...item, IsChecked: isChecked, Title: title };
      }
      return item;
    });
    onChange(newCheckList);
  };

  const totalIsChecked = useMemo(() => {
    return checklist.filter((item) => item.IsChecked).length;
  }, [checklist]);

  const totalLength = useMemo(() => {
    return checklist.length;
  }, [checklist]);

  const progress = useMemo(() => {
    return (totalIsChecked / totalLength) * 100;
  }, [totalIsChecked, totalLength]);

  const handleDeleteCheckListItem = (checkListItem: CheckListItem) => {
    const newCheckList = checklist.filter((item) => item.Id !== checkListItem.Id);
    onChange(newCheckList);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <PolText type="lead" className="flex gap-1">
          Checklist
          {checklist.length > 0 && (
            <p className="flex whitespace-nowrap">
              {totalIsChecked} / {totalLength}
            </p>
          )}
        </PolText>
        {checklist.length > 0 && (
          <>
            <LinearProgress variant="determinate" className="w-full" value={progress} />
            <PolCheckbox value={showOnCard} onValueChanged={onShowOnCardChange}>
              <span className=" whitespace-nowrap text-sm">Show on card</span>
            </PolCheckbox>
          </>
        )}
      </div>
      {checklist.map((item) => (
        <span className="flex items-center gap-1">
          <CircleCheckBox
            isChecked={item.IsChecked}
            onChange={(x) => {
              onItemChange(item.Id, x, item.Title);
            }}
          ></CircleCheckBox>
          <input
            onChange={(x) => {
              onItemChange(item.Id, item.IsChecked, x.currentTarget.value);
            }}
            className="bg-inherit text-sm"
            value={item.Title}
          ></input>
          <X
            onClick={() => handleDeleteCheckListItem(item)}
            className="ml-auto rounded hover:cursor-pointer hover:bg-gray-200"
            size={15}
          ></X>
        </span>
      ))}
      <span className="flex items-center gap-1">
        <CircleCheckBox></CircleCheckBox>
        <input
          value={newItem}
          placeholder="Add an item"
          onChange={(x) => setNewItem(x.currentTarget.value)}
          className="bg-inherit text-sm"
          onKeyDown={handleKeyDown}
        ></input>
      </span>
    </div>
  );
}
