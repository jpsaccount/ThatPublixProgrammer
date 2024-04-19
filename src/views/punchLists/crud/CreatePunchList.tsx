import { PolButton } from "@/components/polComponents/PolButton";
import PolInput from "@/components/polComponents/PolInput";
import PolModal from "@/components/polComponents/PolModal";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { usePunchListHomeViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/punch-lists/index.lazy";
import { PunchList } from "@/sdk/entities/punchList/PunchList";
import { useEffect, useRef, useState } from "react";

interface Props {
  onCreated: () => any;
}

export function CreatePunchList({ onCreated }: Props) {
  const { projectDatabaseId } = usePunchListHomeViewParams();
  const upsert = useDbUpsert(PunchList);
  const [punchList, setPunchList] = useState<PunchList>(new PunchList());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setPunchList(() => {
      const response = new PunchList();
      response.ProjectDatabaseId = projectDatabaseId;
      return response;
    });
  }, [open, projectDatabaseId]);

  const handleChange = (newValue: Partial<PunchList>) => {
    setPunchList((prev) => {
      return { ...prev, ...newValue };
    });
  };

  const handleCreate = async () => {
    await upsert.mutateAsync({ ...punchList });
    setOpen(false);
    onCreated && onCreated();
  };

  return (
    <PolModal
      isOpen={open}
      onOpenChanged={setOpen}
      modalTrigger={
        <PolButton variant="outline" className="w-96 font-sans text-lg hover:bg-white hover:shadow-md">
          New Punch List
        </PolButton>
      }
    >
      <PolInput value={punchList.Title} onValueChanged={(x) => handleChange({ Title: x })} label="Title"></PolInput>
      <PolInput
        value={punchList.Description}
        onValueChanged={(x) => handleChange({ Description: x })}
        label="Description"
      ></PolInput>
      <PolButton variant="outline" className="mt-2 w-full" isLoading={upsert.isPending} onClick={handleCreate}>
        Create
      </PolButton>
    </PolModal>
  );
}
