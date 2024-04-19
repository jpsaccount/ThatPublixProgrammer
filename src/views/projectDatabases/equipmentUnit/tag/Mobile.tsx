import { useMemo } from "react";
import "./style.css";
import rectangle from "@/assets/images/rectangle-10728.svg";
import rectangle2 from "@/assets/images/rectangle-10729.svg";
import moreOptions from "@/assets/images/1.png";
import union from "@/assets/images/union.svg";
import group from "@/assets/images/group-837.png";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { ProjectDatabase } from "@/sdk/entities/project/ProjectDatabase";
import { LightingFixtureUnit } from "@/sdk/entities/project/equipment/LightingFixtureUnit";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolSkeleton from "@/components/polComponents/PolSkeleton";
import { Link } from "@tanstack/react-router";
import { PunchListItem } from "@/sdk/entities/punchList/PunchListItem";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { Status } from "@/sdk/enums/Status";
import QRCode from "react-qr-code";
import { useEquipmentUnitTagViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/equipment-units/$equipmentUnitId/readonly-tag.lazy";

export const Mobile = () => {
  const { projectDatabaseId, equipmentUnitId } = useEquipmentUnitTagViewParams();
  const projectDatabase = useDbQueryFirst(ProjectDatabase, `WHERE c.id = "${projectDatabaseId}"`);
  const lightingFixtureRequest = useDbQueryFirst(LightingFixtureUnit, `WHERE c.id = "${equipmentUnitId}"`);

  const punchListItemRequest = useDbQuery(PunchListItem, `WHERE c.TaggedEntities Contains "${equipmentUnitId}"`);

  const pendingToDos = useMemo(
    () => punchListItemRequest.data?.filter((x) => x.Status != Status.Completed),
    [punchListItemRequest.data],
  );
  const completedToDos = useMemo(
    () => punchListItemRequest.data?.filter((x) => x.Status === Status.Completed),
    [punchListItemRequest.data],
  );
  const url = `${window.location.origin}/project-databases/${projectDatabaseId}/equipment-units/${equipmentUnitId}/tag`;

  return (
    <div className="MOBILE">
      <div className="div">
        <div className="rectangle" />
        <div className="overlap">
          <div className="text-wrapper">Fixture Tag</div>
          <div className="overlap-group">
            <div className="rectangle-2" />
            <div className="rectangle-3" />
            <div className="text-wrapper-2">FOCUS</div>
            <img className="img" alt="Rectangle" src={rectangle} />
            <img className="rectangle-4" alt="Rectangle" src={rectangle2} />
          </div>
        </div>
        <div className="rectangle-5" />
        <PolRequestPresenter
          request={punchListItemRequest}
          containerClassName="text-wrapper"
          onLoading={() => (
            <div>
              <PolSkeleton className="overlap-2 h-6" />
              <PolSkeleton className="overlap-group-2 h-6" />
              <PolSkeleton className="overlap-3 h-6" />
              <PolSkeleton className="overlap-4 h-6" />
            </div>
          )}
          onSuccess={() => punchListItemRequest.data?.map((x) => <PunchListItemView punchListItem={x} />)}
        />
        <div className="text-wrapper-4">PUNCH LIST</div>
        <Link to="/project-databases/$projectDatabaseId/equipment-units/$equipmentUnitId/tag" className="EDIT-2">
          EDIT &gt;
        </Link>
        <div className="rectangle-10" />
        <div className="overlap-5">
          <div className="text-wrapper-5">FOCUS PHOTOS</div>
          <img className="union" alt="Union" src={union} />
          <div className="rectangle-11" />
          <div className="rectangle-12" />
          <div className="text-wrapper-6">DATASHEETS</div>
          <div className="rectangle-13" />
          <div className="text-wrapper-7">DOWNLOAD</div>
        </div>
        <div className="text-wrapper-8">01/03</div>
        <div className="overlap-6">
          <div className="ellipse" />
          <img className="group" alt="Group" src={group} />
        </div>
        <div className="overlap-7">
          <div className="ellipse-2" />
          <img className="group" alt="Group" src="/images/group-838.png" />
        </div>
        <div className="IMAGES-ASSETS">IMAGES &amp; ASSETS</div>
        <Link to="/project-databases/$projectDatabaseId/equipment-units/$equipmentUnitId/tag" className="EDIT-2">
          EDIT &gt;
        </Link>
        <div className="group-wrapper grid">
          <QRCode value={url} className="m-auto h-[80%] w-[80%]"></QRCode>
        </div>
        <div className="overlap-8">
          <div className="rectangle-14" />
          <div className="group-3">
            <img className="img-2" alt="Img" src="/images/image.svg" />
            <div className="text-wrapper-9">MORE INFO</div>
          </div>
        </div>
        <div className="overlap-9">
          <div className="text-wrapper-10">PROJECT</div>
          <PolRequestPresenter
            request={projectDatabase}
            containerClassName="text-wrapper-11"
            onLoading={() => <PolSkeleton className="h-6" />}
            onSuccess={() => projectDatabase.data.Name}
          />
        </div>
        <div className="overlap-10">
          <div className="text-wrapper-10">UID</div>
          <PolRequestPresenter
            request={lightingFixtureRequest}
            containerClassName="text-wrapper-12"
            onLoading={() => <PolSkeleton className="h-6" />}
            onSuccess={() => lightingFixtureRequest.data.UnitId}
          />
        </div>
        <div className="text-wrapper-13">PRIMARY INFO</div>
        <Link to="/project-databases/$projectDatabaseId/equipment-units/$equipmentUnitId/tag" className="EDIT-2">
          EDIT &gt;
        </Link>
      </div>
    </div>
  );
};

function PunchListItemView({ punchListItem }: { punchListItem: PunchListItem }) {
  return (
    <div className="overlap-group-2">
      <div className="rectangle-6" />
      <div className="text-wrapper-3">
        {punchListItem.Title} — {punchListItem.Description}
      </div>
      <img className="image" alt="Image" src={moreOptions} />
      <div className="rectangle-7" />
      <div className="rectangle-9" />
      <div className="rectangle-8" />
    </div>
  );
}
