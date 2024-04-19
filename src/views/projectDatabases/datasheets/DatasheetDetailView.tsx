import EntityImageManager from "@/components/EntityImageManager";
import { PolButton } from "@/components/polComponents/PolButton";
import PolInput from "@/components/polComponents/PolInput";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolText from "@/components/polComponents/PolText";
import { CardContent, CardHeader } from "@/components/ui/card";
import { LiveChangeContextProvider } from "@/contexts/LiveChangeContext";
import { useDbAttachmentUpload } from "@/customHooks/sdkHooks/useDbAttachmentUpload";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { usePartialDbQuery } from "@/customHooks/sdkHooks/usePartialDbQuery";
import useLiveChangeTracking from "@/customHooks/useLiveChangeTracking";
import { useSearchParamState } from "@/customHooks/useSearchParamState";
import { ContentQuality } from "@/sdk/contracts/Entity";
import { Datasheet } from "@/sdk/entities/project/equipment/Datasheet";
import { LightingFixture } from "@/sdk/entities/project/equipment/LightingFixture";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { useEffect, useState } from "react";

export default function DatasheetDetailView() {
  const [datasheetId, setGoboId] = useSearchParamState("id", "");
  const datasheetRequest = useDbQueryFirst(Datasheet, `WHERE c.id = '${datasheetId}'`, {
    enabled: isUsable(datasheetId),
  });
  const fixtureRequest = usePartialDbQuery(LightingFixture, `WHERE c.Datasheets CONTAINS "${datasheetId}"`, 1);

  const mutation = useDbUpsert(Datasheet);
  const uploadMutation = useDbAttachmentUpload(Datasheet);
  const [value, setDatasheet] = useState(new Datasheet());
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);

  useEffect(() => {
    if (datasheetRequest.data) setDatasheet(datasheetRequest.data);
  }, [datasheetRequest.data]);

  const changeLog = useLiveChangeTracking(datasheetRequest, (updates) => {
    setDatasheet((x) => ({ ...x, ...updates }));
  });
  function onChange(updates: Partial<Datasheet>) {
    setDatasheet((x) => ({ ...x, ...updates }));
  }

  async function save() {
    const promises: Promise<any>[] = [mutation.mutateAsync(value)];
    if (uploadedFiles !== null) {
      promises.push(uploadMutation.mutateAsync([value, uploadedFiles[0]]));
    }
    await Promise.all(promises);
    setUploadedFiles(null);
  }
  return (
    <LiveChangeContextProvider changeLog={changeLog}>
      <PolRequestPresenter
        request={datasheetRequest}
        onSuccess={() => (
          <div className="m-auto">
            <CardHeader className="bg-transparent">{value.Title}</CardHeader>
            <CardContent className="flex flex-col gap-2">
              <PolInput label="Name" value={value.Title} onValueChanged={(e) => onChange({ Title: e })}></PolInput>

              <PolInput
                label="Description"
                value={value.Description}
                onValueChanged={(e) => onChange({ Description: e })}
              ></PolInput>

              <PolText type="muted" className="my-2 text-center">
                {fixtureRequest.data?.ItemCount} fixtures using this datasheet
              </PolText>

              <EntityImageManager
                key={"preview"}
                currentFile={uploadedFiles ? uploadedFiles[0] : null}
                uploaderClassName="mt-auto"
                viewerClassName=" h-[50dvh]"
                downloadable={true}
                downloadFileName={value.Title}
                className=" m-auto mt-5 h-[50dvh]"
                entity={value}
                quality={ContentQuality.LightlyCompressed}
                onUpload={setUploadedFiles}
              />

              <PolButton onClick={save}>Save</PolButton>
            </CardContent>
          </div>
        )}
      ></PolRequestPresenter>
    </LiveChangeContextProvider>
  );
}
