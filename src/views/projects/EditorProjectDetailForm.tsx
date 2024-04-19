import PolLoadingSection from "@/components/polComponents/PolLoadingSection";
import PolModal from "@/components/polComponents/PolModal";
import PolMutationErrorPresenter from "@/components/polComponents/PolMutationErrorPresenter";
import PolTable from "@/components/polComponents/PolTable";
import PolTableCell from "@/components/polComponents/PolTableCell";
import PolTableRow from "@/components/polComponents/PolTableRow";
import { useAlert } from "@/contexts/AlertContext";
import { useDbDelete } from "@/customHooks/sdkHooks/useDbDelete";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { Project } from "@/sdk/entities/project/Project";
import { RoleRateByTitle } from "@/sdk/entities/project/RoleRateByTitle";
import { useState } from "react";
import { PolButton } from "../../components/polComponents/PolButton";
import PolCheckbox from "../../components/polComponents/PolCheckbox";
import PolHeading from "../../components/polComponents/PolHeading";
import PolInput from "../../components/polComponents/PolInput";
import PolIcon from "@/components/PolIcon";
import PolTableHeader from "@/components/polComponents/PolTableHeader";

interface Props {
  project: Project;
}

const EditorProjectDetailForm = ({ project }: Props) => {
  const [projectName, setProjectName] = useState<string>(project.Name);
  const [nickname, setNickname] = useState<string>(project.Nickname);
  const [qboProjectName, setQboProjectName] = useState<string>(project.QboProjectName);
  const [showInTimeSheet, setShowInTimeSheet] = useState<boolean>(project.ShowInTimesheet);
  const [roleRates, setRoleRates] = useState(project.DefaultRoleRateByTitle);

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = usePolNavigate();
  const alert = useAlert();
  const deleteMutation = useDbDelete(Project);
  const saveMutation = useDbUpsert(Project);

  const deleteProject = async () => {
    const result = await alert.showAlert({
      title: "Confirmation",
      description: "Are you sure you want to delete this project?",
    });
    if (result === false) return;
    setIsLoading(true);
    await deleteMutation.mutateAsync(project);
    setIsLoading(false);
    navigate({ to: "/projects" });
  };

  const updateRoleRates = (id: string, newProps: Partial<RoleRateByTitle>) => {
    setRoleRates((prevRoleRates) =>
      prevRoleRates.map((roleRate) => (roleRate.Id === id ? { ...roleRate, ...newProps } : roleRate)),
    );
  };

  async function onclose() {
    setIsOpen(false);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setProjectName(project.Name);
    setNickname(project.Nickname);
    setQboProjectName(project.QboProjectName);
    setShowInTimeSheet(project.ShowInTimesheet);
    setRoleRates(project.DefaultRoleRateByTitle);
  }

  async function onSave() {
    const newProject = {
      ...project,
      Name: projectName,
      Nickname: nickname,
      QboProjectName: qboProjectName,
      ShowInTimesheet: showInTimeSheet,
      DefaultRoleRateByTitle: roleRates,
    };

    await saveMutation.mutateAsync(newProject).then(() => setIsOpen(false));
  }

  return (
    <PolModal
      modalTrigger={
        <PolButton onClick={() => setIsOpen(true)} variant="outline">
          Edit
        </PolButton>
      }
      isOpen={isOpen}
      onClose={onclose}
    >
      <PolLoadingSection isLoading={isLoading}>
        <div className="flex min-w-[25rem] flex-col gap-1">
          <PolInput
            type="text"
            onValueChanged={(e) => setProjectName(e)}
            label="Project Name"
            value={projectName}
          ></PolInput>
          <PolInput type="text" onValueChanged={(e) => setNickname(e)} label="Display Name" value={nickname}></PolInput>
          <PolInput
            type="text"
            onValueChanged={(e) => setQboProjectName(e)}
            label="Qbo Project Name"
            value={qboProjectName}
          />
          <PolCheckbox className="mb-3 mt-3" onValueChanged={setShowInTimeSheet} value={showInTimeSheet}>
            Show In Timesheet
          </PolCheckbox>
        </div>
        <div className="mb-3 border-b"></div>

        {roleRates && (
          <div className="flex justify-between">
            <PolHeading size={4}>Role Rates</PolHeading>
            <button
              onClick={() => {
                setRoleRates((prev) => [...prev, new RoleRateByTitle()]);
              }}
            >
              <PolIcon name="Plus"></PolIcon>
            </button>
          </div>
        )}
        <div className="my-2 h-56 overflow-y-auto rounded border p-2">
          <PolTable
            className="mb-3"
            items={roleRates}
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
                    className=" w-56"
                    onValueChanged={(e) => {
                      updateRoleRates(roleRate.Id, { Title: e });
                    }}
                    type="text"
                    value={roleRate.Title}
                  ></PolInput>
                </PolTableCell>
                <PolTableCell className="text-center font-medium">
                  <PolInput
                    onValueChanged={(e) => {
                      updateRoleRates(roleRate.Id, {
                        Rate: e,
                      });
                    }}
                    type="number"
                    value={roleRate.Rate}
                    containerClassName="mx-2"
                    className="text-center"
                  ></PolInput>
                </PolTableCell>
                <PolTableCell className="text-right">
                  <button
                    onClick={() => {
                      setRoleRates((prevRoleRates) => prevRoleRates.filter((rate) => rate.Id !== roleRate.Id));
                    }}
                  >
                    <PolIcon name="Minus" className="m-auto ms-2 hover:cursor-pointer"></PolIcon>
                  </button>
                </PolTableCell>
              </PolTableRow>
            )}
          />
        </div>

        <PolMutationErrorPresenter mutation={[saveMutation, deleteMutation]} />

        <div className=" grid grid-cols-[auto_1fr_auto]">
          <PolButton variant="destructive" onClick={deleteProject}>
            Delete
          </PolButton>
          <div></div>
          <PolButton onClick={onSave}>Save</PolButton>
        </div>
      </PolLoadingSection>
    </PolModal>
  );
};

export default EditorProjectDetailForm;
