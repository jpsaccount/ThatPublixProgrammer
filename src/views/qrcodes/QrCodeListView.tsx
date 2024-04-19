import PolIcon from "@/components/PolIcon";
import EntityTableWithPagination from "@/components/polComponents/EntityTableViews/EntityTableWithPagination";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { usePartialDbQuery } from "@/customHooks/sdkHooks/usePartialDbQuery";
import useSearchParamQueryTemplate from "@/customHooks/sdkHooks/useSearchParamQueryTemplate";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { QrCode } from "@/sdk/entities/core/QrCode";
import { toEquipmentUnitTitle, getFullPurpose } from "@/sdk/utils/entityUtils/equipmentUnitUtils";

export default function QrCodeListView() {
  const { query, searchText, setSearchText } = useSearchParamQueryTemplate(``, ``);
  const qrCodeRequest = usePartialDbQuery(QrCode, "", 50);
  const navigate = usePolNavigate();

  return (
    <EntityTableWithPagination
      searchText={searchText}
      onSearchTextChanged={setSearchText}
      request={qrCodeRequest}
      onRowClicked={(x) =>
        navigate({
          to: "/project-databases/$projectDatabaseId/equipment-units/$equipmentUnitId/tag",
          search: { equipmentUnitId: x.id },
        })
      }
      isVirtualized={true}
      showSearch={true}
      dense={false}
      columns={[{ id: "id" }, { id: "Title" }, { id: "Url" }]}
      orderByProperty="Title"
      mobileRowTemplate={(x, index, props) => (
        <>
          <div
            onClick={() =>
              navigate({
                to: "/project-databases/$projectDatabaseId/equipment-units/$equipmentUnitId/tag",
                search: { equipmentUnitId: x.id },
              })
            }
            tabIndex={-1}
            key={x.id}
            {...props}
            className="mobile-card-item grid grid-flow-col"
          >
            <div className="grid grid-flow-row">
              <span className="text-left font-medium">{x.Title}</span>
              <span className="text-left text-xs">{x.Url}</span>
            </div>
          </div>
        </>
      )}
    />
  );
}
