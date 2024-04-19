import { EntityAttachmentViewer } from "@/components/EntityAttachmentViewer";
import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { ContentQuality } from "@/sdk/contracts/Entity";
import { Logo } from "@/sdk/entities/core/Logo";
import { ProjectDatabase } from "@/sdk/entities/project/ProjectDatabase";
import { TablePagination } from "@mui/material";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import type { ChangeEvent, FC, MouseEvent } from "react";

interface ProjectDatabaseRowProps {
  ProjectDatabase: ProjectDatabase;
}

export default function ProjectDatabaseRow(props: ProjectDatabaseRowProps) {
  const { ProjectDatabase, ...other } = props;

  const documentRequest = useDbQueryFirst(Logo, `WHERE c.id = "${ProjectDatabase.DocumentLogoId}"`);
  const clientLogoRequest = useDbQueryFirst(Logo, `WHERE c.id = "${ProjectDatabase.ClientDocumentLogoId}"`);
  const navigate = usePolNavigate();

  return (
    <TableRow className="last:border-0" {...other}>
      <TableCell className="w-[75px]">
        <PolRequestPresenter
          request={clientLogoRequest}
          onSuccess={() => (
            <EntityAttachmentViewer
              entity={clientLogoRequest.data}
              quality={ContentQuality.CompressedThumbnail}
              viewerClassName="w-14 h-14 aspect-1 mx-auto"
              className="mx-auto rounded-full bg-slate-200"
            />
          )}
        />
      </TableCell>

      <TableCell className="w-[75px]">
        <PolRequestPresenter
          request={documentRequest}
          onSuccess={() => (
            <EntityAttachmentViewer
              entity={documentRequest.data}
              quality={ContentQuality.CompressedThumbnail}
              viewerClassName="w-14 h-14 aspect-1 mx-auto"
              className="mx-auto rounded-full bg-slate-200"
            />
          )}
        />
      </TableCell>
      <TableCell>
        <div className="text-left">
          <p>{ProjectDatabase.Name}</p>
          <p className="text-sm">{ProjectDatabase.Description}</p>
        </div>
      </TableCell>
      <TableCell align="right">
        <PolButton variant="ghost" onClick={() => navigate({ to: ProjectDatabase.id })}>
          <PolIcon name="ArrowRight" />
        </PolButton>
      </TableCell>
    </TableRow>
  );
}

ProjectDatabaseRow.propTypes = {
  // @ts-ignore
  ProjectDatabase: PropTypes.object.isRequired,
};

interface ProjectDatabaseListTableProps {
  count?: number;
  group?: boolean;
  items?: ProjectDatabase[];
  onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page?: number;
  rowsPerPage?: number;
}

export const ProjectDatabaseListTable: FC<ProjectDatabaseListTableProps> = (props) => {
  const {
    group = false,
    items = [],
    count = 0,
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
  } = props;

  let content: JSX.Element;

  content = (
    <div className="m-5 shadow">
      <Table className="rounded-md dark:border dark:border-gray-600 dark:bg-gray-800">
        <TableBody>
          {items.map((ProjectDatabase) => (
            <ProjectDatabaseRow key={ProjectDatabase.id} ProjectDatabase={ProjectDatabase} />
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Stack spacing={4}>
      {content}
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Stack>
  );
};

ProjectDatabaseListTable.propTypes = {
  count: PropTypes.number,
  group: PropTypes.bool,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
function numeral(totalAmount: any) {
  throw new Error("Function not implemented.");
}
