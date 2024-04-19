import { Table, TableBody, TableHeader } from "@/components/ui/table";
import { withComponentMemo } from "@/customHooks/withComponentMemo";
import { deepEquals } from "@/utilities/equalityUtils";

interface Props<T> extends React.HTMLAttributes<unknown> {
  items: T[];
  header: () => React.ReactNode;
  emptyTemplate?: () => React.ReactNode;
  itemTemplate: (item: T, index: number) => React.ReactNode;
  columns?: Column[];
}

interface Column {
  style?: React.CSSProperties;
  className?: string;
}

function NotMemoPolTable<T>({ items, header, itemTemplate, emptyTemplate, columns, ...props }: Props<T>) {
  return (
    <Table {...props}>
      {columns?.length > 0 && (
        <colgroup>
          {columns.map((x) => (
            <col style={x.style} className={x.className} />
          ))}
        </colgroup>
      )}
      {header()}
      <TableBody>
        {items?.length === 0
          ? emptyTemplate && emptyTemplate()
          : items?.map((item, index) => itemTemplate(item, index))}
      </TableBody>
    </Table>
  );
}

function shouldNotRender<T>(oldProps: Props<T>, newProps: Props<T>): boolean {
  return deepEquals(oldProps, newProps);
}

const PolTable = withComponentMemo(NotMemoPolTable, shouldNotRender);

export default PolTable;
