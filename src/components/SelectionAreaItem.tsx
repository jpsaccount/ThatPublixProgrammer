import React, { memo } from "react";
import { deepEquals } from "@/utilities/equalityUtils";

interface Props {
  containerRef?: React.MutableRefObject<null>;
  isSelected: any;
  itemTemplateClassName: string;
  selectedItemClassName: string;
  onClick: () => void;
  reactNode: React.ReactNode;
  Item: any;
}

const shouldNotRender = (oldProps: Readonly<Props>, newProps: Readonly<Props>) => {
  return deepEquals(oldProps.Item, newProps.Item) && oldProps.isSelected == newProps.isSelected;
};

const SelectionAreaItem = memo(function (props: Props) {
  return (
    <div
      key={props.Item.id}
      ref={props.containerRef}
      className={
        props.isSelected ? props.itemTemplateClassName + " " + props.selectedItemClassName : props.itemTemplateClassName
      }
      onClick={props.onClick}
    >
      {props.reactNode}
    </div>
  );
}, shouldNotRender);

export default SelectionAreaItem;
