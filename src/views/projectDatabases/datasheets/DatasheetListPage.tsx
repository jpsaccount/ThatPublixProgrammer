import PolIcon from "@/components/PolIcon";
import EntityTableWithPagination from "@/components/polComponents/EntityTableViews/EntityTableWithPagination";
import PolSideSheet from "@/components/polComponents/PolSideSheet";
import { usePartialDbQuery } from "@/customHooks/sdkHooks/usePartialDbQuery";
import useSearchParamQueryTemplate from "@/customHooks/sdkHooks/useSearchParamQueryTemplate";
import { useSearchParamState } from "@/customHooks/useSearchParamState";
import { Datasheet } from "@/sdk/entities/project/equipment/Datasheet";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import DatasheetDetailView from "./DatasheetDetailView";

export default function DatasheetListPage() {
  const { query, searchText, setSearchText } = useSearchParamQueryTemplate('WHERE c.Title Contains "{0}"');
  const goboRequest = usePartialDbQuery(Datasheet, query, 20);
  const [datasheetId, setDatasheetId] = useSearchParamState("id", "");

  return (
    <>
      <EntityTableWithPagination
        pageTitle="Datasheets"
        request={goboRequest}
        onRowClicked={(x) => setDatasheetId(x.id)}
        isVirtualized={true}
        showSearch={true}
        dense={false}
        searchText={searchText}
        onSearchTextChanged={setSearchText}
        columns={[{ id: "Title" }]}
        orderByProperty="Title"
        mobileRowTemplate={(x, index, props) => (
          <div
            className="mobile-card-item grid grid-flow-col"
            onClick={() => setDatasheetId(x.id)}
            tabIndex={-1}
            key={x.id}
            {...props}
          >
            <div className="grid grid-flow-row">
              <span className="text-left font-medium">{x.Title}</span>
            </div>
            <div className="ml-auto text-right">
              {x.AttachmentMetadata.HasAttachment ? <PolIcon name="Paperclip" /> : <></>}
            </div>
          </div>
        )}
      />

      <PolSideSheet isOpen={!isNullOrWhitespace(datasheetId)} onOpenChanged={(e) => !e && setDatasheetId(undefined)}>
        {datasheetId && <DatasheetDetailView></DatasheetDetailView>}
      </PolSideSheet>
    </>
  );
}
