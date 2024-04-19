import { Entity } from "@/sdk/contracts/Entity";
import { QueryObserverResult } from "@tanstack/react-query";
import { ReactNode } from "react";
import PolHeading from "../PolHeading";
import PolInput from "../PolInput";
import { PolRequestPresenter } from "../PolRequestPresenter";
import EntityTableView, { EntityTableViewProp } from "./EntityTableView";
import { isUsable } from "@/sdk/utils/usabilityUtils";

export interface EntityTableWithAddOnProps<T> extends EntityTableViewProp<T> {
  searchText?: string;
  onSearchTextChanged?: (text: string) => void;
  tableWrapper?: (children: ReactNode) => ReactNode;
  addons?: ReactNode[];
  header?: ReactNode;
  pageTitle?: ReactNode;
  disableHeader?: boolean;
  request?: QueryObserverResult<T[], Error>;
}

function EntityTableWithHeader<T extends Entity>({
  pageTitle,
  orderByProperty,
  orderByDirection: orderByPropertySortDirection = "asc",
  columns: headCells,
  rowsPerPage,
  dense,
  isVirtualized = true,
  disableHeader = false,
  className,
  averageItemSize = 75,
  mobileRowTemplate,
  onRowClicked,
  rowClassName,
  searchText,
  onSearchTextChanged,
  addons,
  request,
  data = request?.data,
  headerClassName,
  emptyView,
  header,
  ...props
}: EntityTableWithAddOnProps<T>) {
  const tableComponent = (
    <div className="w-full">
      <>
        <EntityTableView
          {...props}
          rowClassName={rowClassName}
          data={data}
          orderByProperty={orderByProperty}
          orderByDirection={orderByPropertySortDirection}
          columns={headCells}
          rowsPerPage={rowsPerPage}
          dense={dense}
          isVirtualized={isVirtualized}
          className={className}
          averageItemSize={averageItemSize}
          mobileRowTemplate={mobileRowTemplate}
          onRowClicked={onRowClicked}
          headerClassName={headerClassName}
          emptyView={emptyView}
        ></EntityTableView>
      </>
    </div>
  );
  const component = (
    <div className="w-full">
      {disableHeader === false && (
        <div className="items-center justify-between  border-b border-gray-200 bg-background-50  p-4 dark:border-gray-700 sm:flex">
          <div className="mb-1 grid w-full grid-flow-row">
            {isUsable(pageTitle) && (
              <div className="mb-4">
                {typeof pageTitle === "string" ? <PolHeading size={1}>{pageTitle}</PolHeading> : pageTitle}
              </div>
            )}
            <div className="flex w-full flex-col-reverse items-center md:flex-row ">
              <PolInput
                className="mt-1 w-full md:mt-0 md:w-auto"
                data-testid={"searchInput"}
                value={searchText}
                placeholder="Search"
                valueChangeOn="change"
                onValueChanged={onSearchTextChanged}
              ></PolInput>
              {addons}
            </div>
            {header}
          </div>
        </div>
      )}
      {request ? <PolRequestPresenter request={request} onSuccess={() => tableComponent} /> : tableComponent}
    </div>
  );
  return component;
}

export default EntityTableWithHeader;
