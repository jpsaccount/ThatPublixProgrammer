import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import PolHeading from "@/components/polComponents/PolHeading";
import PolInput from "@/components/polComponents/PolInput";
import PolModal from "@/components/polComponents/PolModal";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolSkeleton from "@/components/polComponents/PolSkeleton";
import PolText from "@/components/polComponents/PolText";
import { Seo } from "@/components/polComponents/Seo";
import { useDbDelete } from "@/customHooks/sdkHooks/useDbDelete";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { usePhaseActivityBucketDetailViewParams } from "@/routes/_auth/timesheet/dropdowns/$id.lazy";
import { PhaseActivityBucket } from "@/sdk/entities/billing/PhaseActivityBucket";
import { Role } from "@/sdk/entities/billing/Role";
import { SubTask } from "@/sdk/entities/billing/SubTask";
import { Task } from "@/sdk/entities/billing/Task";
import { Popover } from "@mui/material";
import { Tooltip } from "flowbite-react";
import { useState } from "react";

export default function PhaseActivityBucketDetailView() {
  const { id } = usePhaseActivityBucketDetailViewParams();
  const phaseActivityBucketRequest = useDbQueryFirst(PhaseActivityBucket, `WHERE c.id = "${id}"`);
  return (
    <>
      <Seo title="Time Activity Buckets" />
      <PolRequestPresenter
        request={phaseActivityBucketRequest}
        onSuccess={() => (
          <div className="grid grid-flow-row p-2">
            <PolHeading>{phaseActivityBucketRequest.data.Title}</PolHeading>
            <hr className="my-2" />
            <PhaseActivityView />
          </div>
        )}
      ></PolRequestPresenter>
    </>
  );
}

function PhaseActivityView() {
  const { id } = usePhaseActivityBucketDetailViewParams();
  const [newRole, setNewRole] = useState(null);
  const rolesRequest = useDbQuery(Role, `WHERE c.PhaseActivityBucketId = "${id}"`);
  const upsertRole = useDbUpsert(Role);

  function openNewRole() {
    const newRole = new Role();
    newRole.PhaseActivityBucketId = id;
    newRole.ShowInTimesheet = true;
    setNewRole(newRole);
  }

  async function saveNewRole() {
    await upsertRole.mutateAsync(newRole);
    setNewRole(null);
    await rolesRequest.refetch();
  }

  return (
    <>
      <PolModal isOpen={newRole !== null} onClose={() => setNewRole(null)}>
        <div className="grid grid-flow-row gap-2">
          <PolInput
            label="Name"
            value={newRole?.Title}
            onValueChanged={(value) => setNewRole((x) => ({ ...x, Title: value }))}
          />
          <PolButton className="mt-2" onClick={saveNewRole}>
            Save
          </PolButton>
        </div>
      </PolModal>
      <PolRequestPresenter
        request={rolesRequest}
        onSuccess={() => (
          <div className="grid grid-flow-row p-2">
            <div className="grid grid-flow-col grid-cols-[auto_1fr] ">
              <PolButton onClick={openNewRole} className="mx-2 h-8 w-8 rounded-full p-0">
                <PolIcon name="Plus" stroke="white" />
              </PolButton>
              <PolHeading>Roles</PolHeading>
            </div>
            <div className="flex flex-row">
              {rolesRequest.data.map((x) => (
                <RoleView x={x}></RoleView>
              ))}
            </div>
          </div>
        )}
      />
    </>
  );
}

function RoleView({ x }: { x: Role }) {
  const tasksRequest = useDbQuery(Task, `WHERE c.RoleId = "${x.id}"`);
  const upsertTask = useDbUpsert(Task);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [newTaskTitle, setNewTaskTitle] = useState("");

  async function addTask() {
    const task = new Task();
    task.RoleId = x.id;
    task.Title = newTaskTitle;
    task.ShowInTimesheet = true;
    await upsertTask.mutateAsync(task);
    setAnchorEl(null);
    await tasksRequest.refetch();
  }

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className="m-2 w-[20dvw] min-w-[300px] border bg-background-50 p-2">
      <PolHeading size={3}>{x.Title}</PolHeading>
      <hr className="my-1" />
      <div className="grid grid-flow-col grid-cols-[1fr_auto]">
        <PolText type="bold" className="text-md text-text-700">
          Tasks
        </PolText>
        <PolButton onClick={handleClick} variant="ghost" className="h-[unset] p-0 ">
          <PolIcon name="Plus" stroke="var(--text-700)" />
        </PolButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <div className="grid grid-flow-col grid-cols-[1fr_auto] p-2">
            <PolInput label="Title" value={newTaskTitle} onValueChanged={setNewTaskTitle} />
            <PolButton onClick={addTask} variant="ghost" className="ml-1 mt-auto px-2">
              <PolIcon name="Plus" />
            </PolButton>
          </div>
        </Popover>
      </div>
      <PolRequestPresenter
        request={tasksRequest}
        onLoading={() => <PolSkeleton className="h-9"></PolSkeleton>}
        onSuccess={() => (
          <div className="grid grid-flow-row">
            {tasksRequest.data.map((i) => (
              <TaskView x={i} />
            ))}
          </div>
        )}
      />
    </div>
  );
}

function TaskView({ x }: { x: Task }) {
  const subtasksRequest = useDbQuery(SubTask, `WHERE c.TaskId = "${x.id}"`);
  const upsertSubTask = useDbUpsert(SubTask);
  const upsertTask = useDbUpsert(Task);
  const deleteTask = useDbDelete(Task);
  const deleteSubtask = useDbDelete(SubTask);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [newTaskTitle, setNewTaskTitle] = useState("");

  async function addSubTask() {
    const subTask = new SubTask();
    subTask.TaskId = x.id;
    subTask.Title = newTaskTitle;
    subTask.ShowInTimesheet = true;
    await upsertSubTask.mutateAsync(subTask);
    setAnchorEl(null);
    await subtasksRequest.refetch();
  }

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className="my-1 grid grid-flow-row border bg-background-100 p-2">
      <div className="grid grid-flow-col grid-cols-[auto_1fr_auto_auto]">
        <PolButton onClick={() => deleteTask.mutateAsync(x)} variant="ghost" className="mr-2 h-[unset] p-0">
          <PolIcon name="Trash2" stroke="var(--text-700)" />
        </PolButton>

        <PolText className="text-text-700">{x.Title}</PolText>
        <PolButton
          onClick={() => upsertTask.mutateAsync({ ...x, ShowInTimesheet: !x.ShowInTimesheet })}
          variant="ghost"
          className="mr-2 h-[unset] p-0"
        >
          <PolIcon name={x.ShowInTimesheet ? "Eye" : "EyeOff"} stroke="var(--text-700)" />
        </PolButton>
        <Tooltip content="Add Sub Task">
          <PolButton onClick={handleClick} variant="ghost" className="h-[unset] p-0 ">
            <PolIcon name="ListPlus" stroke="var(--text-700)" />
          </PolButton>
        </Tooltip>
      </div>
      <hr className="my-1" />

      <div className="grid grid-flow-col grid-cols-[1fr_auto]">
        <div></div>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <div className="grid grid-flow-col grid-cols-[1fr_auto] p-2">
            <PolInput
              label="Title"
              value={newTaskTitle}
              onValueChanged={setNewTaskTitle}
              onKeyUp={(e) => e.key == "Enter" && addSubTask()}
            />
            <PolButton onClick={addSubTask} variant="ghost" className="ml-1 mt-auto px-2">
              <PolIcon name="Plus" />
            </PolButton>
          </div>
        </Popover>
      </div>
      <div className="ml-2 grid grid-flow-row">
        <PolRequestPresenter
          request={subtasksRequest}
          onLoading={() => <PolSkeleton className="h-8" />}
          onSuccess={() =>
            subtasksRequest.data.map((i) => (
              <>
                <div className="grid grid-cols-[auto_1fr]">
                  <PolButton onClick={() => deleteSubtask.mutateAsync(i)} variant="ghost" className="h-[unset] p-0 ">
                    <PolIcon name="X" stroke="var(--text-700)" size="20px" className="mr-2" />
                  </PolButton>
                  <PolText className="text-md" type="muted">
                    {i.Title}
                  </PolText>
                </div>
                <hr />
              </>
            ))
          }
        />
      </div>
    </div>
  );
}
