import UserProfilePicture from "@/components/navbar/UserProfilePicture";
import PatternDropdown from "@/components/polComponents/GeneralSdkComponents/PatternDropdown";
import { PolButton } from "@/components/polComponents/PolButton";
import { PolDropdown } from "@/components/polComponents/PolDropdown";
import PolEntityDropdown from "@/components/polComponents/PolEntityDropdown";
import PolInput from "@/components/polComponents/PolInput";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolSkeleton from "@/components/polComponents/PolSkeleton";
import PolText from "@/components/polComponents/PolText";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { cn } from "@/lib/utils";
import { ContentQuality } from "@/sdk/contracts/Entity";
import { ProjectDatabase } from "@/sdk/entities/project/ProjectDatabase";
import { ControlType } from "@/sdk/entities/project/equipment/EquipmentControl";
import { EquipmentType } from "@/sdk/entities/project/equipment/EquipmentType";
import { LightingFixture } from "@/sdk/entities/project/equipment/LightingFixture";
import { LightingFixtureConfiguration } from "@/sdk/entities/project/equipment/LightingFixtureConfiguration";
import { LightingFixtureUnit } from "@/sdk/entities/project/equipment/LightingFixtureUnit";
import { RevitEquipmentUnitChange } from "@/sdk/entities/project/equipment/revit/RevitEquipmentUnitChange";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import EquipmentUnitChanges from "./EquipmentUnitChanges";
import { useEquipmentUnitEditorViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/equipment-units/$equipmentUnitId/tag.lazy";

interface Props {
  value?: LightingFixtureUnit;
  onChange: (newProps: Partial<LightingFixtureUnit>) => void;
  className?: string;
}

const contentTypes = [
  { id: ControlType.ACN, name: "ACN" },
  { id: ControlType.ArtNet, name: "ArtNet" },
  { id: ControlType.DMXPT, name: "DMXPT" },
  { id: ControlType.KiNET, name: "KiNET" },
  { id: ControlType.PWR, name: "PWR" },
  { id: ControlType.SA, name: "SA" },
  { id: ControlType.Unknown, name: "Unknown" },
  { id: ControlType.ZTTV, name: "ZTTV" },
  { id: ControlType.DMX, name: "DMX" },
  { id: ControlType.None, name: "None" },
];

export default function EquipmentUnitDetailEditorView({ value, onChange, className }: Props) {
  const { projectDatabaseId } = useEquipmentUnitEditorViewParams();

  const equipmentCategoryRequest = useDbQuery(EquipmentType);

  const projectDatabaseRequest = useDbQueryFirst(ProjectDatabase, "WHERE c.id = '" + projectDatabaseId + "'");
  const lastRevitImportChanged = useDbQueryFirst(
    RevitEquipmentUnitChange,
    "WHERE c.EquipmentUnitId = '" + value?.id + "' Order By c.CreatedDateTime DESC",
    { enabled: isUsable(value) },
  );
  const equipmentTypesRequest = useDbQuery(
    LightingFixtureConfiguration,
    "WHERE c.EquipmentTypeGroupId IN [" +
      projectDatabaseRequest.data?.EquipmentTypeGroups.map((x) => `"${x}"`).join(",") +
      "]",
    { enabled: isUsable(projectDatabaseRequest.data) },
  );
  const equipmentRequest = useDbQuery(
    LightingFixture,
    `WHERE c.id IN ["${equipmentTypesRequest.data?.map((x) => x.EquipmentId).join('","')}"]`,
    { enabled: isUsable(equipmentTypesRequest.data) },
  );

  return (
    <div className={cn("flex flex-col gap-2 p-2", className)}>
      {/* <div className="flex gap-2">
        <PolInput
          onValueChanged={(e) => {
            onChange({ UnitNumber: e });
          }}
          value={value.UnitNumber}
          label="Unit Number"
        ></PolInput>
        <PolInput
          onValueChanged={(e) => {
            onChange({ UnitNumberIndex: e });
          }}
          value={value.UnitNumberIndex}
          label="Unit Number Index"
        ></PolInput>
        <PolInput
          onValueChanged={(e) => {
            onChange({ UnitLetterIndex: e });
          }}
          value={value.UnitLetterIndex}
          label="Unit Letter Index"
        ></PolInput>
      </div> */}
      <div className="flex gap-2">
        <PolInput
          containerClassName="w-full"
          onValueChanged={(e) => {
            onChange({ Panel: e });
          }}
          value={value.Panel}
          label="Panel"
        ></PolInput>
        <PolInput
          containerClassName="w-full"
          label="Circuit"
          onValueChanged={(e) =>
            onChange({
              Circuit: e,
            })
          }
          value={value.Circuit}
        ></PolInput>
      </div>
      <div className="grid grid-cols-[1fr_.5fr] gap-2">
        <PolInput
          containerClassName="w-full"
          onValueChanged={(e) => {
            onChange({ Purpose: e });
          }}
          value={value.Purpose}
          label="Purpose"
        ></PolInput>
        <PolInput
          containerClassName="w-full"
          onValueChanged={(e) => {
            onChange({ SubPurpose: e });
          }}
          value={value.SubPurpose}
          label="Sub Purpose"
        ></PolInput>
      </div>
      <div className="flex">
        <PolInput
          containerClassName="w-full"
          onValueChanged={(e) => {
            onChange({ Location: e });
          }}
          value={value.Location}
          label="Location"
        ></PolInput>
      </div>
      <div className="grid gap-2">
        <PolEntityDropdown
          sortBy="nameGetter"
          containerClassName="w-full"
          label="Equipment Type"
          nameGetter={(x) =>
            (equipmentCategoryRequest.data?.find((i) => i.id === x.EquipmentCategoryId)?.Code ?? "...") +
            x.Index +
            x.Index2 +
            ": " +
            (equipmentRequest.data?.find((i) => i.id === x.EquipmentId)?.Nickname ?? "...")
          }
          options={equipmentTypesRequest.data}
          selectedId={value.EquipmentTypeId}
          onValueChanged={(x) => onChange({ EquipmentTypeId: x.id })}
        ></PolEntityDropdown>
      </div>
      <div className="my-2 w-full border-b"></div>
      <div className="flex gap-2">
        <PolInput
          isMultiline={true}
          containerClassName="w-full"
          onValueChanged={(e) => onChange({ Settings: e })}
          value={value.Settings}
          label="Settings"
        ></PolInput>
      </div>
      <PolDropdown
        containerClassName="w-full"
        nameGetter={(x) => x.name}
        value={contentTypes.find((x) => x.id === value.Control.Type)}
        onValueChanged={(newType) => onChange({ Control: { ...value.Control, Type: newType.id } })}
        options={contentTypes}
        label="Control Type"
      ></PolDropdown>
      <div className="flex gap-2">
        <PolInput
          containerClassName="w-full"
          label="Universe"
          onValueChanged={(e) =>
            onChange({
              Control: {
                ...value.Control,
                DMXUniverse: e,
              },
            })
          }
          value={value.Control?.DMXUniverse}
        ></PolInput>
        <PolInput
          containerClassName="w-full"
          label="Address"
          onValueChanged={(e) =>
            onChange({
              Control: {
                ...value.Control,
                DMXAddress: e,
              },
            })
          }
          value={value.Control?.DMXAddress}
        ></PolInput>
      </div>
      <div className="flex gap-2">
        <PolInput
          containerClassName="w-full"
          onValueChanged={(e) => {
            onChange({ LCIO: e });
          }}
          value={value.LCIO}
          label="LCIO"
        ></PolInput>
        <PolInput
          containerClassName="w-full"
          label="Channel"
          onValueChanged={(e) =>
            onChange({
              Channel: e,
            })
          }
          value={value.Channel}
        ></PolInput>
      </div>
      <div className="flex gap-2">
        <PolInput
          containerClassName="w-full"
          label="Filter"
          onValueChanged={(e) =>
            onChange({
              Filter: e,
            })
          }
          value={value.Filter}
        ></PolInput>
      </div>

      <div className="grid w-full grid-flow-col grid-cols-[1fr_1fr] gap-2">
        <PatternDropdown
          label={"Pattern"}
          patternId={value.PatternId}
          onChange={(pattern) => onChange({ PatternId: pattern })}
        />

        <PolInput
          label="Size"
          onValueChanged={(e) =>
            onChange({
              PatternSize: e,
            })
          }
          value={value.PatternSize}
        ></PolInput>
      </div>

      <div className="grid grid-flow-col grid-cols-[1fr_1fr] gap-2">
        <PatternDropdown
          label={"Pattern 2"}
          patternId={value.Pattern2Id}
          onChange={(pattern) => onChange({ Pattern2Id: pattern })}
        />

        <PolInput
          label="Size"
          onValueChanged={(e) =>
            onChange({
              Pattern2Size: e,
            })
          }
          value={value.Pattern2Size}
        ></PolInput>
      </div>
      <div className="my-2 w-full border-b"></div>
      <PolInput
        containerClassName="w-full"
        label="Accessories"
        onValueChanged={(e) =>
          onChange({
            Accessories: e,
          })
        }
        value={value.Accessories}
      ></PolInput>
      <PolInput
        containerClassName="w-full"
        label="Description"
        onValueChanged={(e) =>
          onChange({
            Description: e,
          })
        }
        value={value.Description}
      ></PolInput>
      <PolInput
        containerClassName="w-full"
        label="Focus Notes"
        onValueChanged={(e) =>
          onChange({
            SetupNotes: e,
          })
        }
        value={value.SetupNotes}
      ></PolInput>
      <PolInput
        containerClassName="w-full"
        label="Installation Notes"
        onValueChanged={(e) =>
          onChange({
            InstallNotes: e,
          })
        }
        value={value.InstallNotes}
      ></PolInput>
      <PolInput
        containerClassName="w-full"
        label="Internal Notes"
        onValueChanged={(e) =>
          onChange({
            InternalNotes: e,
          })
        }
        value={value.InternalNotes}
      ></PolInput>

      <div className="grid grid-flow-col grid-cols-[auto_1fr] items-center">
        <UserProfilePicture
          contentQuality={ContentQuality.CompressedThumbnail}
          userId={value.ModifiedByUserId}
          className="mr-1 h-6 w-6"
        />
        <PolText type={"muted"} className="m-auto ml-0 text-right">
          Last updated on: {value.ModifiedDateTime.local().format("MM/DD/YYYY hh:mm:ss A")}
        </PolText>
      </div>
      <PolRequestPresenter
        request={lastRevitImportChanged}
        onLoading={() => <PolSkeleton className="h-8" />}
        onSuccess={() => {
          let text = "Never imported";
          if (lastRevitImportChanged.data) {
            text =
              "Last imported on: " +
              lastRevitImportChanged.data?.ModifiedDateTime.local().format("MM/DD/YYYY hh:mm:ss A");
          }
          return (
            <div className="grid grid-flow-col grid-cols-[auto_1fr] items-center">
              {lastRevitImportChanged.data ? (
                <UserProfilePicture
                  contentQuality={ContentQuality.CompressedThumbnail}
                  userId={lastRevitImportChanged.data.CreatedByUserId}
                  className="mr-1 h-6 w-6"
                />
              ) : (
                <div className="mr-1 h-6 w-6"></div>
              )}
              <PolText type={"muted"} className="m-auto ml-0 text-right">
                {text}
              </PolText>
            </div>
          );
        }}
      ></PolRequestPresenter>

      <Drawer>
        <DrawerTrigger>
          <PolButton>Show All Changes</PolButton>
        </DrawerTrigger>
        <DrawerContent className="h-[50dvh] max-h-[50dvh] bg-background-50">
          <DrawerHeader className="p-1">
            <DrawerTitle>Recent Changes</DrawerTitle>
          </DrawerHeader>
          <EquipmentUnitChanges value={value}></EquipmentUnitChanges>
          <DrawerFooter>
            <DrawerClose>Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
