import { useEffect, useState } from "react";
import { PolButton } from "../../../components/polComponents/PolButton";
import PolInput from "../../../components/polComponents/PolInput";

import PolEntityDropdown from "@/components/polComponents/PolEntityDropdown";
import PolMutationErrorPresenter from "@/components/polComponents/PolMutationErrorPresenter";
import PolTable from "@/components/polComponents/PolTable";
import PolTableCell from "@/components/polComponents/PolTableCell";
import PolTableRow from "@/components/polComponents/PolTableRow";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { Role } from "@/sdk/entities/billing/Role";
import { Project } from "@/sdk/entities/project/Project";
import { RoleRateById } from "@/sdk/entities/project/RoleRateById";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { PhaseActivityBucket } from "@sdk/./entities/billing/PhaseActivityBucket";
import { PhaseBillingType } from "@sdk/./enums/PhaseBillingType";
import PolCheckbox from "../../../components/polComponents/PolCheckbox";
import { PolDropdown } from "../../../components/polComponents/PolDropdown";
import PolIcon from "@/components/PolIcon";
import PolTableHeader from "@/components/polComponents/PolTableHeader";

interface Props {
  workingPhase: WorkingPhase;
  phaseActivityBuckets: PhaseActivityBucket[];
  onSave: () => any;
}
const phaseBillingTypes = [
  { value: PhaseBillingType.TimeAndMaterials, label: "Time And Materials" },
  { value: PhaseBillingType.LumpSum, label: "Lump Sum" },
  { value: PhaseBillingType.Expenses, label: "Expenses" },
  { value: PhaseBillingType.NotBillable, label: "Not Billable" },
];

const WorkingPhaseEditor = ({ workingPhase, phaseActivityBuckets, onSave }: Props) => {
  const [currentWorkingPhase, setCurrentWorkingPhase] = useState<WorkingPhase>(null);

  const rolesRequest = useDbQuery(
    Role,
    `WHERE c.PhaseActivityBucketId = "${currentWorkingPhase?.PhaseActivityBucketId}"`,
    { enabled: isUsable(currentWorkingPhase) },
  );
  const projectRequest = useDbQueryFirst(Project, `WHERE c.id = "${currentWorkingPhase?.ProjectId}"`, {
    enabled: isUsable(currentWorkingPhase),
  });

  useEffect(() => {
    setCurrentWorkingPhase({ ...workingPhase });
  }, [workingPhase]);

  const saveChanges = useDbUpsert(WorkingPhase, {
    onSuccess: (data) => {},
  });

  async function addDefaultRates() {
    const roles = rolesRequest.data;
    const newWorkingPhase = { ...workingPhase };
    const project = projectRequest.data;

    const roleRates = roles.map((x) => {
      const roleRate = new RoleRateById();

      roleRate.RoleId = x.id;
      roleRate.Rate = project.DefaultRoleRateByTitle.find((i) => i.Title === x.Title)?.Rate ?? 0;

      return roleRate;
    });
    newWorkingPhase.RoleRates.push(...roleRates);

    setCurrentWorkingPhase(newWorkingPhase);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-flow-col gap-5">
        <PolInput
          type="text"
          value={currentWorkingPhase?.Title}
          onValueChanged={(value) => setCurrentWorkingPhase((x) => ({ ...x, Title: value }))}
          label="Title"
        ></PolInput>
        <PolInput
          type="text"
          value={currentWorkingPhase?.DisplayName}
          onValueChanged={(value) => setCurrentWorkingPhase((x) => ({ ...x, DisplayName: value }))}
          label="Display Name"
        ></PolInput>
      </div>
      <PolCheckbox
        value={currentWorkingPhase?.ShowInTimesheet}
        onValueChanged={(value) => setCurrentWorkingPhase((x) => ({ ...x, ShowInTimesheet: value }))}
      >
        Show in timesheet
      </PolCheckbox>
      <div className="grid grid-flow-col gap-5">
        <PolDropdown<{
          value: PhaseBillingType;
          label: string;
        }>
          isSearchable={false}
          placeHolder="Select"
          nameGetter={(x) => x.label}
          options={phaseBillingTypes}
          label="Billing Type"
          value={phaseBillingTypes.find((x) => x.value == currentWorkingPhase?.PhaseBillingType)}
          onValueChanged={(value) => setCurrentWorkingPhase((x) => ({ ...x, PhaseBillingType: value.value }))}
        ></PolDropdown>
        {currentWorkingPhase?.PhaseBillingType !== PhaseBillingType.Expenses && (
          <PolEntityDropdown
            placeHolder="Select"
            nameGetter={(x) => x.Title}
            options={phaseActivityBuckets}
            label="Timesheet Dropdown Group"
            selectedId={currentWorkingPhase?.PhaseActivityBucketId}
            onValueChanged={(value) =>
              setCurrentWorkingPhase((x) => ({
                ...x,
                PhaseActivityBucketId: value.id,
              }))
            }
          />
        )}
      </div>
      <div className="grid grid-flow-col gap-5">
        <PolInput
          type="Date"
          label="Start Date"
          value={currentWorkingPhase?.StartDate}
          onValueChanged={(value) => setCurrentWorkingPhase((x) => ({ ...x, StartDate: value }))}
        ></PolInput>
        <PolInput
          type="Date"
          label="End Date"
          value={currentWorkingPhase?.EndDate}
          onValueChanged={(value) => setCurrentWorkingPhase((x) => ({ ...x, EndDate: value }))}
        ></PolInput>
      </div>
      <div className="mb-3 mt-3 border-b"></div>

      <div className="h-56 overflow-y-auto">
        <PolTable
          className="mb-3"
          items={currentWorkingPhase?.RoleRates}
          header={() => (
            <PolTableHeader className="sticky h-10">
              <PolTableCell className="text-left">Title</PolTableCell>
              <PolTableCell className="w-28 text-center font-medium">Rate</PolTableCell>
              <PolTableCell className="text-right"> </PolTableCell>
            </PolTableHeader>
          )}
          itemTemplate={(roleRate) => (
            <PolTableRow key={roleRate.Id}>
              <PolTableCell className="text-left">
                <PolInput
                  isDisabled={true}
                  className=" w-56"
                  onValueChanged={(e) => {}}
                  type="text"
                  value={rolesRequest?.data?.find((x) => x.id === roleRate.RoleId)?.Title}
                ></PolInput>
              </PolTableCell>
              <PolTableCell className="text-center font-medium">
                <PolInput
                  onValueChanged={(e) => {
                    setCurrentWorkingPhase((x) => ({
                      ...x,
                      RoleRates: x.RoleRates.map((x) => (x.Id === roleRate.Id ? { ...roleRate, Rate: e } : x)),
                    }));
                  }}
                  type="number"
                  value={roleRate.Rate}
                  containerClassName="mx-2"
                  className="text-center"
                ></PolInput>
              </PolTableCell>
              <PolTableCell className="text-right">
                <button>
                  <PolIcon name="Minus" className="m-auto ms-2 hover:cursor-pointer"></PolIcon>
                </button>
              </PolTableCell>
            </PolTableRow>
          )}
          emptyTemplate={() => (
            <div>
              <div className="grid">
                <PolButton onClick={addDefaultRates} className="m-auto mt-5">
                  Add Default Rates
                </PolButton>
              </div>
            </div>
          )}
        />
      </div>

      <PolMutationErrorPresenter mutation={[saveChanges]} />
      <PolButton
        className="m-auto"
        onClick={() => saveChanges.mutateAsync(currentWorkingPhase).then((t) => onSave && onSave())}
      >
        Save
      </PolButton>
    </div>
  );
};

export default WorkingPhaseEditor;
