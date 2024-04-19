import PolIcon from "@/components/PolIcon";
import { PunchListItem } from "@/sdk/entities/punchList/PunchListItem";
import { Link } from "@tanstack/react-router";
import { ClipboardCheck, Link as LinkIcon } from "lucide-react";
import React, { useMemo, useState } from "react";

interface Props {
  punchListItem: PunchListItem;
  projectDatabaseId: string;
}

export default function CopyPunchListItemLink({ punchListItem, projectDatabaseId }: Props) {
  const fullPath = useMemo(() => {
    return `/project-databases/${projectDatabaseId}/punch-lists?punchListItemId=${punchListItem.id}`;
  }, [punchListItem, projectDatabaseId]);

  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setCopied(true);
    const fullUrl = `${window.location.origin}${fullPath}`;
    await navigator.clipboard.writeText(fullUrl);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="justify-content flex w-full items-center justify-start gap-1 p-1 hover:bg-gray-100"
    >
      {copied ? (
        <>
          <ClipboardCheck size={15}></ClipboardCheck> Copied
        </>
      ) : (
        <>
          <LinkIcon size={15}></LinkIcon> Copy Link
        </>
      )}
    </button>
  );
}
