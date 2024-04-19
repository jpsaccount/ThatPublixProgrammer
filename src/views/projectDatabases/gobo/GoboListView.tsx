import PolIcon from "@/components/PolIcon";
import EntityTableWithPagination from "@/components/polComponents/EntityTableViews/EntityTableWithPagination";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { usePartialDbQuery } from "@/customHooks/sdkHooks/usePartialDbQuery";
import useSearchParamQueryTemplate from "@/customHooks/sdkHooks/useSearchParamQueryTemplate";
import { useSearchParamState } from "@/customHooks/useSearchParamState";
import { Pattern } from "@/sdk/entities/project/equipment/Pattern";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import GoboDetail from "./GoboDetail";

const GoboListView = () => {
  const { query, searchText, setSearchText } = useSearchParamQueryTemplate(
    'WHERE c.Name Contains "{0}" OR c.Model Contains "{0}"',
  );
  const goboRequest = usePartialDbQuery(Pattern, query, 20);

  const [goboId, setGoboId] = useSearchParamState("id", "");

  return (
    <>
      <EntityTableWithPagination
        addons={[]}
        pageTitle="Gobos"
        request={goboRequest}
        onRowClicked={(x) => setGoboId(x.id)}
        isVirtualized={true}
        showSearch={true}
        dense={false}
        searchText={searchText}
        onSearchTextChanged={setSearchText}
        columns={[
          { idGetter: (x) => x.Name, label: "Name", id: "Name" },
          { id: "Model" },
          {
            id: "AttachmentMetadata.HasAttachment",
            idGetter: (x) => x.AttachmentMetadata.HasAttachment,
            label: "Attachment",
            renderCell: (x) => (x ? <PolIcon name="Paperclip" /> : <></>),
          },
        ]}
        orderByProperty="Name"
        mobileRowTemplate={(x, index, props) => (
          <div
            className="mobile-card-item grid grid-flow-col"
            onClick={() => setGoboId(x.id)}
            tabIndex={-1}
            key={x.id}
            {...props}
          >
            <div className="grid grid-flow-row">
              <span className="text-left font-medium">{x.Name}</span>
              <span className="text-left text-xs">{x.Model}</span>
            </div>
            <div className="ml-auto text-right">
              {x.AttachmentMetadata.HasAttachment ? <PolIcon name="Paperclip" /> : <></>}
            </div>
          </div>
        )}
      />

      <Sheet modal={false} open={!isNullOrWhitespace(goboId)} onOpenChange={(e) => !e && setGoboId(undefined)}>
        <SheetContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="w-1/3 min-w-[350px]"
        >
          {goboId && <GoboDetail></GoboDetail>}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default GoboListView;
