import PolIcon from "@/components/PolIcon";
import PolSpinner from "@/components/polComponents/PolSpinner";
import { cn } from "@/lib/utils";
import { isUsable } from "@sdk/./utils/usabilityUtils";
import { UseQueryResult } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useMemo } from "react";
import { PolButton } from "./PolButton";
import PolText from "./PolText";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";

interface Props {
  request: UseQueryResult<unknown, Error>[] | UseQueryResult<unknown, Error>;
  ready?: boolean;
  onSuccess?: () => ReactNode;
  onLoading?: () => ReactNode;
  onFailure?: (errors: UseQueryResult<unknown, Error>[]) => ReactNode;
  showWhenNullResults?: boolean;
  showWhenPending?: boolean;
  containerClassName?: string;
}

export function PolRequestPresenter({
  request,
  onSuccess: OnSuccess,
  onFailure: OnFailure,
  onLoading: OnLoading,
  showWhenPending = false,
  showWhenNullResults = false,
  ready = true,
  containerClassName,
}: Props) {
  const Request = Array.isArray(request) ? request : [request];

  const isResultsUsable = useMemo(
    () => Request.every((x) => isUsable(x.data) || (showWhenPending && x.isPending)) || showWhenNullResults,
    [Request],
  );
  const isLoadingRequests = useMemo(
    () => Request.filter((x) => x.isLoading || (x.isPending && showWhenPending == false)),
    [Request],
  );
  const errorRequests = useMemo(() => Request.filter((x) => isUsable(x.error?.message)), [Request]);
  const error = useMemo(() => [...new Set(errorRequests.map((x) => x.error?.message))].join(", "), [errorRequests]);

  let results;
  let resultsKey;

  if ((isLoadingRequests.length === 0 || errorRequests.length > 0) && ready) {
    if (
      Request.filter((x) => x.isSuccess) &&
      isLoadingRequests.length === 0 &&
      errorRequests.length === 0 &&
      isResultsUsable
    ) {
      resultsKey = "success";
      results = OnSuccess();
    } else if (isUsable(OnFailure)) results = OnFailure(errorRequests);
    else if (isNullOrWhitespace(error) && isResultsUsable === false) {
      results = <></>;
    } else {
      resultsKey = "error";

      results = (
        <div className="m-auto grid grid-flow-row">
          <h4>{error}</h4>
          {isResultsUsable === false && Request.filter((x) => x.isSuccess === false).length > 0 && (
            <PolButton
              variant="ghost"
              className="mx-auto"
              onClick={() => Request.forEach((x) => x.refetch())}
              title="Retry"
            >
              <div className="grid grid-flow-col space-x-2">
                <PolIcon name="RotateCw" className="m-auto" />
                <PolText>Retry</PolText>
              </div>
            </PolButton>
          )}
        </div>
      );
    }
  }

  if (isUsable(results) === false) {
    resultsKey = "loading";

    results = OnLoading ? (
      OnLoading()
    ) : (
      <div className="center-Items absolute bottom-0 left-0 right-0 top-0 grid h-full">
        <PolSpinner className="m-auto" IsLoading={true} />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={cn("h-full w-full", containerClassName)}
        key={resultsKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {results}
      </motion.div>
    </AnimatePresence>
  );
}
