import PolIcon from "@/components/PolIcon";
import { useDbDelete } from "@/customHooks/sdkHooks/useDbDelete";
import { PunchListItem } from "@/sdk/entities/punchList/PunchListItem";
import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";

interface Props {
  punchListItem: PunchListItem;
}

export default function DeletePunchListItem({ punchListItem }: Props) {
  const mutation = useDbDelete(PunchListItem);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setIsLoading(true);
    await mutation.mutateAsync(punchListItem);
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleDelete}
      className="flex w-full items-center justify-start gap-1 rounded bg-red-50 p-1 text-red-500 hover:bg-red-100"
    >
      {isLoading ? (
        <Loader2Icon size={20} className="mx-auto animate-spin"></Loader2Icon>
      ) : (
        <>
          {" "}
          <PolIcon name="Trash" size="15" stroke="rgb(240 82 82 / var(--tw-text-opacity))"></PolIcon>Delete
        </>
      )}
    </button>
  );
}
