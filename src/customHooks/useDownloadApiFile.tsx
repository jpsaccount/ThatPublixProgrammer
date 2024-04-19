import { useToast } from "@/components/ui/use-toast";
import { getFilePost } from "@/utilities/downloadUtils";
import React, { useCallback } from "react";

interface Props {
  url: string;
  fileName: string;
  queryParams: string;
}

export default function useDownloadApiFile() {
  const { toast } = useToast();
  const download = useCallback(async ({ url, fileName, queryParams }: Props) => {
    try {
      await getFilePost(url, fileName, queryParams);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }, []);

  return download;
}
