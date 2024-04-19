import PolIcon from "@/components/PolIcon";
import PolHeading from "@/components/polComponents/PolHeading";
import PolModal from "@/components/polComponents/PolModal";
import PolSpinner from "@/components/polComponents/PolSpinner";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { Dropdown } from "flowbite-react";
import React, { SetStateAction } from "react";
import GlobalExpenseReportDetailView from "./GlobalExpenseReportDetailView";
import { useDbDelete } from "@/customHooks/sdkHooks/useDbDelete";
import { GlobalExpenseReport } from "@/sdk/entities/billing/GlobalExpenseReport";

interface Props {
  currentExpenseReport: GlobalExpenseReport;
  setCurrentExpenseReport: React.Dispatch<SetStateAction<GlobalExpenseReport>>;
  onSave: () => any;
}

export default function GlobalExpenseReportsDetailViewModal({
  currentExpenseReport,
  setCurrentExpenseReport,
  onSave,
}: Props) {
  const deleteMutation = useDbDelete(GlobalExpenseReport);
  return (
    <PolModal
      className="w-[100dvw] min-w-[50dvw] sm:w-1/2"
      heading={
        <>
          <div className="grid grid-flow-col grid-cols-[auto_1fr]">
            <Dropdown
              className="z-[10000]"
              arrowIcon={false}
              inline
              label={<PolIcon data-testid="moreOptionsButton" name="MoreVertical"></PolIcon>}
            >
              <Dropdown.Item
                className="rounded-lg"
                onClick={() =>
                  deleteMutation.mutateAsync(currentExpenseReport).then((x) => setCurrentExpenseReport(null))
                }
              >
                Delete
              </Dropdown.Item>
            </Dropdown>

            <PolHeading className="m-auto" size={3}>
              Global Expense Report
            </PolHeading>
          </div>
        </>
      }
      isOpen={isUsable(currentExpenseReport)}
      onClose={() => setCurrentExpenseReport(null)}
    >
      {deleteMutation.isPending ? (
        <div className="grid p-10">
          <PolSpinner IsLoading={true} className="m-auto" />
        </div>
      ) : (
        <GlobalExpenseReportDetailView
          onSave={onSave}
          globalExpenseReport={currentExpenseReport}
          setGlobalExpenseReport={setCurrentExpenseReport}
        ></GlobalExpenseReportDetailView>
      )}
    </PolModal>
  );
}
