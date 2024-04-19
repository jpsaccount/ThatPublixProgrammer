import { Check } from "lucide-react";
import React, { useState } from "react";

interface Props {
  isChecked?: boolean;
  onChange?: (isChecked: boolean) => void;
  onClick?: (e) => void;
}

export default function CircleCheckBox({ isChecked, onChange, onClick }: Props) {
  const [mouseInside, setMouseInside] = useState(false);

  return (
    <>
      {isChecked ? (
        <>
          <span
            onMouseEnter={() => setMouseInside(true)}
            onMouseLeave={() => setMouseInside(false)}
            className="flex h-4 w-4 items-center justify-center rounded-full border border-blue-800 bg-blue-600 hover:cursor-pointer hover:bg-blue-500"
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick(e);

              onChange && onChange(false);
            }}
          >
            <Check size={12} stroke="white"></Check>
          </span>
        </>
      ) : (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onClick && onClick(e);

            onChange && onChange(true);
          }}
          onMouseEnter={() => setMouseInside(true)}
          onMouseLeave={() => setMouseInside(false)}
          className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 hover:cursor-pointer hover:bg-gray-100"
        >
          {mouseInside && <Check size={12} stroke="rgb(209 213 219 / var(--tw-border-opacity))"></Check>}
        </span>
      )}
    </>
  );
}
