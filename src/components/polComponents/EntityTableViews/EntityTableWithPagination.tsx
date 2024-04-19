import { CustomPageQueryResult } from "@/customHooks/sdkHooks/usePartialDbQuery";
import { Entity } from "@/sdk/contracts/Entity";
import { useCallback } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { PolRequestPresenter } from "../PolRequestPresenter";
import EntityTableWithHeader, { EntityTableWithAddOnProps } from "./EntityTableWithHeader";
import { PolButton } from "../PolButton";

interface PaginationProps<T> {
  page?: number;
  total?: number;
  getNextPage: () => Promise<void> | void;
  getPreviousPage: () => Promise<void> | void;
  setCurrentPage?: (page: number) => void;
}

function Pagination<T>({ page, total, getNextPage, getPreviousPage, setCurrentPage }: PaginationProps<T>) {
  return (
    <div className="notch-safe sticky bottom-0 right-0 w-full items-center border-t border-gray-200 bg-secondary-50 p-2 dark:border-gray-700 sm:flex sm:justify-between">
      <div className="flex items-center sm:mb-0">
        <PolButton variant="ghost" onClick={getPreviousPage}>
          <span className="sr-only">Previous page</span>
          <HiChevronLeft className="text-2xl" />
        </PolButton>
        <PolButton variant="ghost" onClick={getNextPage}>
          <span className="sr-only">Next page</span>
          <HiChevronRight className="text-2xl" />
        </PolButton>
        <span className="text-sm font-normal text-text-950">
          Page&nbsp;
          <span className="font-semibold">{page}</span>
          &nbsp;of&nbsp;
          <span className="font-semibold">{total}</span>
        </span>
      </div>
      {/* <div className="flex items-center space-x-3">
        {getPreviousPage && (
          <PolButton onClick={getPreviousPage}>
            <span className="flex items-center">
              <HiChevronLeft className="mr-1 text-base" />
              <span>Previous</span>
            </span>
          </PolButton>
        )}

        {getNextPage && (
          <PolButton onClick={getNextPage}>
            <span className="flex items-cetner">
              <span>Next</span>
              <HiChevronRight className="ml-1 text-base" />
            </span>
          </PolButton>
        )}
      </div> */}
    </div>
  );
}
export interface EntityTableWithPaginationProps<T> extends Omit<EntityTableWithAddOnProps<T>, "request"> {
  request: CustomPageQueryResult<T>;
  showSearch?: boolean;
}

function EntityTableWithPagination<T extends Entity>({
  request,
  orderByProperty,
  orderByDirection: orderByPropertySortDirection = "asc",
  columns: headCells,
  rowsPerPage,
  dense,
  isVirtualized = false,
  showSearch,
  className,
  averageItemSize = 75,
  mobileRowTemplate,
  onRowClicked,
  searchText,
  onSearchTextChanged,
  pageTitle,
  addons,
  rowClassName,
  headerClassName,
  emptyView = "No results found",
  header,
  ...props
}: EntityTableWithPaginationProps<T>) {
  const tableWrapper = useCallback(
    (children) => <PolRequestPresenter request={request} onSuccess={() => children}></PolRequestPresenter>,
    [request],
  );
  return (
    <div className="w-full">
      <EntityTableWithHeader
        header={header}
        addons={addons}
        pageTitle={pageTitle}
        rowClassName={rowClassName}
        data={request.data?.Items}
        orderByProperty={orderByProperty}
        orderByDirection={orderByPropertySortDirection}
        columns={headCells}
        rowsPerPage={rowsPerPage}
        dense={dense}
        isVirtualized={isVirtualized}
        disableHeader={showSearch == false}
        className={className}
        averageItemSize={averageItemSize}
        mobileRowTemplate={mobileRowTemplate}
        onRowClicked={onRowClicked}
        searchText={searchText}
        onSearchTextChanged={onSearchTextChanged}
        headerClassName={headerClassName}
        emptyView={emptyView}
        tableWrapper={tableWrapper}
        {...props}
      ></EntityTableWithHeader>
      <Pagination
        total={request.data?.PageCount}
        page={request.data?.PageCount < request.data?.CurrentPage ? 0 : request.data?.CurrentPage}
        getNextPage={request.data?.CurrentPage < request.data?.PageCount ? request.fetchNextPage : undefined}
        getPreviousPage={request.data?.CurrentPage > 1 ? request.fetchPreviousPage : undefined}
        setCurrentPage={request.setCurrentPage}
      ></Pagination>
    </div>
  );
}

export default EntityTableWithPagination;
