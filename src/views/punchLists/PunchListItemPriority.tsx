import { Priority } from "@/sdk/enums/Priority";
import React from "react";

interface Props {
  priority: Priority;
}

export default function PunchListItemPriority({ priority }: Props) {
  switch (priority) {
    case Priority.VeryLow:
      return <span className="rounded-md border border-gray-400 bg-gray-100 px-1 text-sm text-gray-700">Very Low</span>;
    case Priority.Low:
      return <span className="rounded-md border border-green-400 bg-green-100 px-1 text-sm text-green-700">Low</span>;
    case Priority.Normal:
      return (
        <span className="rounded-md border border-yellow-400 bg-yellow-100 px-1 text-sm text-yellow-700">Normal</span>
      );
    case Priority.High:
      return (
        <span className="rounded-md border border-orange-400 bg-orange-100 px-1 text-sm text-orange-700">High</span>
      );
    case Priority.VeryHigh:
      return <span className="rounded-md border border-red-400 bg-red-100 px-1 text-sm text-red-700">Very High</span>;
  }
}
