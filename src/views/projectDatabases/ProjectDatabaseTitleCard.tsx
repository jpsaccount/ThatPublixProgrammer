import { EntityAttachmentViewer } from "@/components/EntityAttachmentViewer";
import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import PolHeading from "@/components/polComponents/PolHeading";
import PolModal from "@/components/polComponents/PolModal";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { ContentQuality } from "@/sdk/contracts/Entity";
import { Logo } from "@/sdk/entities/core/Logo";
import { ProjectDatabase } from "@/sdk/entities/project/ProjectDatabase";
import EditProjectDatabase from "./EditProjectDatabase";

interface Props {
  projectDatabase: ProjectDatabase;
}

const ProjectDatabaseTitleCard = ({ projectDatabase }: Props) => {
  const clientLogoRequest = useDbQueryFirst(Logo, `WHERE c.id = "${projectDatabase.ClientDocumentLogoId}"`);
  const documentLogoRequest = useDbQueryFirst(Logo, `WHERE c.id = "${projectDatabase.DocumentLogoId}"`, {});
  return (
    <div className="mb-5 grid w-full grid-flow-col grid-cols-[auto_1fr_auto_auto] items-center  gap-2 border-b p-2 dark:border-gray-600">
      <PolModal
        heading="Edit Project Database"
        modalTrigger={
          <PolButton variant="ghost" className="w-fit border-0">
            <PolIcon name="Edit" source="material" />
          </PolButton>
        }
      >
        <EditProjectDatabase projectDatabase={projectDatabase}></EditProjectDatabase>
      </PolModal>
      <PolHeading className="w-fit" size={2}>
        {projectDatabase.Name}
      </PolHeading>
      <EntityAttachmentViewer
        className="w-20"
        quality={ContentQuality.LightlyCompressed}
        entity={clientLogoRequest.data}
      ></EntityAttachmentViewer>

      <EntityAttachmentViewer
        className="w-20"
        quality={ContentQuality.LightlyCompressed}
        entity={documentLogoRequest.data}
      ></EntityAttachmentViewer>
    </div>
  );
};

export default ProjectDatabaseTitleCard;
