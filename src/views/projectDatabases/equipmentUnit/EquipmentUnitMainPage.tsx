import DynamicTabs from "@/components/DynamicTabs";
import PolIcon from "@/components/PolIcon";
import PolHeading from "@/components/polComponents/PolHeading";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { Seo } from "@/components/polComponents/Seo";
import useDbCaching from "@/customHooks/sdkHooks/useDbCaching";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { cn } from "@/lib/utils";
import { LightingFixtureUnit } from "@/sdk/entities/project/equipment/LightingFixtureUnit";
import { toEquipmentUnitTitle } from "@/sdk/utils/entityUtils/equipmentUnitUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { useCallback, useEffect, useRef, useState } from "react";
import EquipmentUnitDetailEditorView from "./EquipmentUnitDetailEditorView";
import FocusPhotoDisplay from "./EquipmentUnitFocusPhotoViewer";
import EquipmentUnitSharingView from "./EquipmentUnitSharingView";
import EquipmentUnitPunchListView from "./EquipmentUnitPunchListView";
import { Link } from "@tanstack/react-router";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PolButton } from "@/components/polComponents/PolButton";
import PolInput from "@/components/polComponents/PolInput";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import useDevice from "@/customHooks/useDevice";

interface Props {
  projectDatabaseId: string;
  equipmentUnitId: string;
  value: LightingFixtureUnit;
  onChange: (newProps: Partial<LightingFixtureUnit>) => void;
  isSaving?: boolean;
}

const EquipmentUnitMainPage = ({ projectDatabaseId, equipmentUnitId, value, onChange, isSaving = false }: Props) => {
  const navigate = usePolNavigate();
  const device = useDevice();
  const { setFirstQueryCache: cacheEntity } = useDbCaching();
  const allEquipmentUnitRequest = useDbQuery(
    LightingFixtureUnit,
    `WHERE c.ProjectDatabaseId = "${projectDatabaseId}" ORDER BY c.UnitNumber asc, c.UnitNumberIndex asc, c.UnitLetterIndex asc`,
  );

  const [previousEquipmentUnitId, setPreviousEquipmentUnitId] = useState<string | null>(null);
  const [nextEquipmentUnitId, setNextEquipmentUnitId] = useState<string | null>(null);

  useEffect(() => {
    if (isUsable(allEquipmentUnitRequest.data) === false) return;
    const equipmentUnit = allEquipmentUnitRequest.data;

    const currentIndex = equipmentUnit.findIndex(
      (x) =>
        x.UnitNumber === value.UnitNumber &&
        x.UnitNumberIndex === value.UnitNumberIndex &&
        x.UnitLetterIndex === value.UnitLetterIndex,
    );
    if (currentIndex === -1) return;

    const previousEquipmentUnit = equipmentUnit[currentIndex - 1];
    const nextEquipmentUnit = equipmentUnit[currentIndex + 1];

    setNextEquipmentUnitId(nextEquipmentUnit?.id ?? null);
    setPreviousEquipmentUnitId(previousEquipmentUnit?.id ?? null);
    if (nextEquipmentUnit) cacheEntity(LightingFixtureUnit, nextEquipmentUnit);
    if (previousEquipmentUnit) cacheEntity(LightingFixtureUnit, previousEquipmentUnit);
  }, [allEquipmentUnitRequest.data, value]);

  const searchRef = useRef(null);

  const [isShowingSearch, setIsShowingSearch] = useState(false);
  const [goToText, setGoToText] = useState("");

  const equipmentUnitRequest = useDbQueryFirst(
    LightingFixtureUnit,
    `WHERE c.UnitId = "${goToText}" AND c.ProjectDatabaseId = "${projectDatabaseId}"`,
  );

  const GoToFixture = useCallback(() => {
    navigate({
      to: "/project-databases/$projectDatabaseId/equipment-units/$equipmentUnitId/tag",
      params: { equipmentUnitId: equipmentUnitRequest.data.id, projectDatabaseId: projectDatabaseId },
    });
    setIsShowingSearch(false);
  }, [equipmentUnitRequest.data]);

  const header = () => (
    <>
      <div className="grid grid-flow-row grid-rows-[auto_1fr_auto]">
        <div className="grid grid-flow-row">
          {/* <button className="" onClick={() => navigate("..")}>
            <PolIcon name="manage_search" source="google" size="2rem" />
          </button> */}

          <div className="m-auto grid w-[40dvw] grid-flow-col">
            <Link
              to="/project-databases/$projectDatabaseId/equipment-units/$equipmentUnitId/tag"
              params={{
                projectDatabaseId: projectDatabaseId,
                equipmentUnitId: previousEquipmentUnitId ?? equipmentUnitId,
              }}
              className={cn("p-2", previousEquipmentUnitId ? "" : "opacity-0")}
            >
              <PolIcon name="ArrowLeft" />
            </Link>
            <PolHeading size={3} className="my-auto">
              {toEquipmentUnitTitle(value)}
            </PolHeading>
            <Link
              to="/project-databases/$projectDatabaseId/equipment-units/$equipmentUnitId/tag"
              params={{ projectDatabaseId: projectDatabaseId, equipmentUnitId: nextEquipmentUnitId ?? equipmentUnitId }}
              className={cn("p-2", nextEquipmentUnitId ? "" : "opacity-0")}
            >
              <PolIcon name="ArrowRight" />
            </Link>

            {device.isMobile === false && (
              <Popover open={isShowingSearch} onOpenChange={setIsShowingSearch}>
                <PopoverTrigger>
                  <PolButton variant="ghost">
                    <PolIcon name="Search" />
                  </PolButton>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="grid grid-flow-col">
                    <PolInput
                      value={goToText}
                      onValueChanged={setGoToText}
                      onKeyUp={(e) => e.key == "Enter" && GoToFixture()}
                    />
                    <PolButton variant="ghost" className="mx-1 my-auto h-[unset] p-2" onClick={() => GoToFixture()}>
                      <PolIcon
                        name="Send"
                        stroke={equipmentUnitRequest.data ? "var(--primary-500)" : "var(--background-950)"}
                      />
                    </PolButton>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
    </>
  );
  return (
    <>
      <Seo title={"Equipment Units | " + toEquipmentUnitTitle(value)} />
      <PolRequestPresenter
        request={allEquipmentUnitRequest}
        onSuccess={() => (
          <DynamicTabs
            mobileSettings={{
              headerPosition: "bottom",
              headerClassName: "fixed bottom-0 notch-safe pt-1 pl-1 pr-1 w-full bg-background-100 z-10 ",
              header: header,
              container: (children) => (
                <div className="m-auto grid grid-flow-row">
                  <Popover open={isShowingSearch} onOpenChange={setIsShowingSearch}>
                    <PopoverTrigger asChild>
                      <PolButton variant="ghost" className="sticky top-[50px] ml-auto">
                        <PolIcon name="Search" />
                      </PolButton>
                    </PopoverTrigger>
                    <PopoverContent className="absolute top-[50px] h-10 w-[80dvw] p-0.5">
                      <div className="grid h-8 grid-flow-col grid-cols-[1fr_auto]">
                        <PolInput
                          className="h-8"
                          containerClassName="h-8"
                          value={goToText}
                          onValueChanged={setGoToText}
                          onKeyUp={(e) => e.key == "Enter" && GoToFixture()}
                        />
                        <PolButton variant="ghost" className="mx-1 my-auto h-8 p-2" onClick={() => GoToFixture()}>
                          <PolIcon
                            name="Send"
                            stroke={equipmentUnitRequest.data ? "var(--primary-500)" : "var(--background-950)"}
                          />
                        </PolButton>
                      </div>
                    </PopoverContent>
                  </Popover>
                  {children}
                </div>
              ),
            }}
            desktopSettings={{
              headerClassName: "pt-5",
              header: header,
              container: (children) => <div className="m-auto grid grid-flow-col gap-4">{children}</div>,
            }}
            title={toEquipmentUnitTitle(value)}
            tabs={[
              {
                header: (isSelected) => <PolIcon name="FileEdit" className="3rem" isIconFilled={isSelected} />,
                value: "Editor",
                content: <EquipmentUnitDetailEditorView value={value} onChange={onChange} />,
              },
              {
                header: (isSelected) => <PolIcon name="ListTodo" isIconFilled={isSelected} />,
                value: "Punch Lists",
                showInDesktop: false,
                content: <EquipmentUnitPunchListView equipmentUnitId={value?.id}></EquipmentUnitPunchListView>,
              },
              ,
              {
                header: (isSelected) => <PolIcon name="Image" isIconFilled={isSelected} />,
                value: "Focus-Photos",
                content: <FocusPhotoDisplay equipmentUnitId={value?.id}></FocusPhotoDisplay>,
              },
              {
                header: (isSelected) => <PolIcon name="ScanBarcode" isIconFilled={isSelected} />,
                value: "Qr",
                content: (
                  <EquipmentUnitSharingView projectDatabaseId={projectDatabaseId} equipmentUnitId={equipmentUnitId} />
                ),
              },
            ]}
          ></DynamicTabs>
        )}
      />
    </>
  );
};

export default EquipmentUnitMainPage;
