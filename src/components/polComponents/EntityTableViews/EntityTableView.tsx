import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { Entity } from "@sdk/./contracts/Entity";
import { KeyOfStringOrNumber } from "@sdk/./models/KeyOfStringOrNumber";
import { Virtualizer, useWindowVirtualizer } from "@tanstack/react-virtual";
import { ReactNode, useCallback, useRef, useState } from "react";
import PolText from "../PolText";
import { AnimatePresence, motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHeader } from "@/components/ui/table";
import useDevice from "@/customHooks/useDevice";
import PolIcon from "@/components/PolIcon";
import useAfterMountedEffect from "@/customHooks/useAfterMountedEffect";

function tableCell<T>(column: Column<T>, row: T) {
  if (column.renderCell) {
    return column.renderCell(row);
  }
  if (column.idGetter) {
    return <PolText>{column.idGetter(row)}</PolText>;
  }
  return row[column.id as keyof T];
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T | ((data: T) => any)) {
  if (typeof orderBy === "function") {
    const compareA = a ? orderBy(a) : -1;
    const compareB = b ? orderBy(b) : -1;
    if (compareB < compareA) {
      return -1;
    }
    if (compareB > compareA) {
      return 1;
    }
    return 0;
  }
  const keyA: keyof T = orderBy;
  const keyB: keyof T = orderBy;

  if (b[keyB] < a[keyA]) {
    return -1;
  }
  if (b[keyB] > a[keyA]) {
    return 1;
  }
  return 0;
}

export type Order = "asc" | "desc";

export interface ColumnOrder {
  propertyName: any;
  order: Order;
}

export interface Column<T> {
  id?: KeyOfStringOrNumber<T> | string;
  idGetter?: (data: T) => any;
  renderCell?: (data: T) => ReactNode;
  sortBy?: (data: T) => any;
  searchKey?: (data: T) => any;
  label?: string;
  align?: "left" | "center" | "right";
  width?: number;
  onClick?: (data: T) => void | Promise<void>;
}

export interface EntityTableViewProp<T> {
  data?: T[];
  columns: Column<T>[];
  orderByProperty?: KeyOfStringOrNumber<T> | ((data: T) => any);
  onOrderByChanged?: (columnOrder: ColumnOrder) => any;
  orderByDirection?: Order;
  mobileRowTemplate?: (data: T, index: number, props?: {}) => ReactNode;
  rowsPerPage?: number;
  dense?: boolean;
  isVirtualized?: boolean;
  className?: string;
  averageItemSize?: number;
  onRowClicked?: (data: T) => void;
  listContainerRef?: React.MutableRefObject<any>;
  rowVirtualizer?: Virtualizer<Window, Element>;
  rowClassName?: (data: T, index: number) => string;
  tableWrapper?: (children: ReactNode) => ReactNode;
  headerClassName?: string;
  emptyView?: ReactNode;
  rowWrapper?: (children: ReactNode, row: T) => ReactNode;
}

export default function EntityTableView<T extends Entity>({
  rowWrapper,
  data,
  orderByDirection = "asc",
  columns,
  isVirtualized = true,
  className,
  averageItemSize = 75,
  mobileRowTemplate,
  onRowClicked,
  rowClassName,
  tableWrapper,
  headerClassName,
  emptyView,
  onOrderByChanged,
}: EntityTableViewProp<T>) {
  let tableComponent = undefined;
  let tableOffset = 0;
  isVirtualized = false;

  const [orderByState, setOrderByState] = useState<ColumnOrder>(null);

  useAfterMountedEffect(() => {
    onOrderByChanged && onOrderByChanged(orderByState);
  }, [orderByState]);

  const device = useDevice();

  const listContainerRef = useRef(null);

  const rowVirtualizer = useWindowVirtualizer({
    count: data?.length ?? 0,
    scrollMargin: listContainerRef.current?.offsetTop ?? 0,
    estimateSize: () => averageItemSize,
    overscan: 15,
  });

  const getRow = useCallback(
    (row: T, index: number) => {
      let components: ReactNode = (
        <motion.tr
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          id={row.id}
          key={index}
          onClick={() => onRowClicked && onRowClicked(row)}
          className={cn(
            "bg-background-50 transition-[background] duration-200 hover:bg-secondary-50",
            (onRowClicked || rowWrapper) && "cursor-pointer",
            rowClassName && rowClassName(row, index),
          )}
        >
          {columns.map((x) => (
            <TableCell
              className="p-4"
              style={{ width: x.width }}
              onClick={(e) => {
                if (x.onClick) {
                  e.stopPropagation();
                  x.onClick(row);
                }
              }}
            >
              {tableCell(x, row) as ReactNode}
            </TableCell>
          ))}
        </motion.tr>
      );
      if (rowWrapper) {
        components = rowWrapper(components, row);
      }
      return <AnimatePresence mode="wait">{components}</AnimatePresence>;
    },
    [rowWrapper, rowClassName, onRowClicked, columns],
  );

  const virtualItems = rowVirtualizer.getVirtualItems();

  tableOffset = virtualItems[0]?.start - rowVirtualizer.options.scrollMargin;

  const virtualizeItems = rowVirtualizer?.getVirtualItems();

  if (device.isMobile && mobileRowTemplate) {
    if (isVirtualized) {
      tableComponent = (
        <>
          <div ref={listContainerRef} className="w-full" style={{ position: "relative" }}>
            <div
              style={{
                position: "relative",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${tableOffset}px)`,
              }}
            >
              {virtualizeItems?.map((row) => {
                return mobileRowTemplate(data[row.index], row.index, {
                  ref: rowVirtualizer.measureElement,
                  key: row.key,
                  "data-index": row.index,
                });
              })}
            </div>
          </div>
        </>
      );
    } else {
      tableComponent = (
        <>
          <ScrollArea ref={listContainerRef}>
            {data?.map((row, index) => {
              return mobileRowTemplate(row, index, {});
            })}
          </ScrollArea>
        </>
      );
    }
  } else {
    tableComponent = (
      <Table className="h-full min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <TableHeader
          className={cn(
            "sticky top-[48px] z-10 border-b border-solid border-background-100 backdrop-blur",
            headerClassName,
          )}
        >
          {columns.map((x) => (
            <TableCell
              style={{ borderCollapse: "separate", borderSpacing: "0", width: x.width }}
              className="!rounded-none border-b bg-background-t-100"
              key={x.id}
            >
              <div
                className={cn("flex  flex-row gap-2", onOrderByChanged && x.id && "cursor-pointer")}
                onClick={() =>
                  x.id &&
                  onOrderByChanged &&
                  setOrderByState((old) => {
                    const propertyName = x.id;
                    if (old?.propertyName === propertyName) {
                      return { propertyName: propertyName, order: old?.order != "asc" ? "asc" : "desc" };
                    }

                    return { propertyName: propertyName, order: "asc" };
                  })
                }
              >
                <PolText>{x.label ?? x.id}</PolText>
                {x.id && onOrderByChanged && (
                  <PolIcon
                    name={
                      orderByState?.propertyName != x.id
                        ? "ArrowUpDown"
                        : orderByState.order === "asc"
                          ? "ArrowUpAZ"
                          : "ArrowDownZA"
                    }
                    size="1rem"
                    className="my-auto"
                  />
                )}
              </div>
            </TableCell>
          ))}
        </TableHeader>
        <TableBody className="divide-y divide-gray-200 bg-background-t-50 dark:divide-gray-700">
          {(isUsable(data) === false || data?.length === 0) === false && data?.map((row, index) => getRow(row, index))}

          <AnimatePresence>
            {(isUsable(data) === false || data?.length === 0) && (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TableCell colSpan={columns.length}>
                  <AnimatePresence>
                    {typeof emptyView === "string" ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <PolText className="my-5 text-center">{emptyView}</PolText>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {emptyView}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TableCell>
              </motion.tr>
            )}
          </AnimatePresence>
        </TableBody>
      </Table>
    );
  }

  return <div className={cn("w-full", className)}>{tableWrapper ? tableWrapper(tableComponent) : tableComponent}</div>;
}
