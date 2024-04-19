import { PolButton } from "@/components/polComponents/PolButton";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import useDownloadApiFile from "@/customHooks/useDownloadApiFile";
import { useEquipmentUnitQrPrintViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/equipment-units/qr-codes.lazy";
import { ProjectDatabase } from "@/sdk/entities/project/ProjectDatabase";
import { getEntityService } from "@/sdk/services/getEntityService";
interface Props {
  units: string[];
}

const PrintUnits = ({ units }: Props) => {
  const { projectDatabaseId } = useEquipmentUnitQrPrintViewParams();
  const projectDatabaseRequest = useDbQueryFirst(ProjectDatabase, `WHERE c.id = "${projectDatabaseId}"`);

  const download = useDownloadApiFile();
  const onPrintClicked = async () => {
    const route = await getEntityService(ProjectDatabase).createRoute(`${projectDatabaseId}/unit-tags/print`);
    await download({
      url: route,
      fileName: projectDatabaseRequest.data ? projectDatabaseRequest.data.Name + " - Tags.pdf" : "unknown.pdf",
      queryParams: `WHERE c.id IN ['${units.join("','")}']`,
    });
  };

  return (
    <>
      <PolButton onClick={onPrintClicked}>Print {units.length} Units</PolButton>
    </>
  );
};

export default PrintUnits;
