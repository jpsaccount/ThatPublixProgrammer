import type { ChangeEvent, FC, FormEvent } from "react";
import { useCallback, useRef } from "react";
import PropTypes from "prop-types";
import FormGroup from "@mui/material/FormGroup";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { Theme } from "@mui/material/styles/createTheme";
import PolHeading from "@/components/polComponents/PolHeading";
import { PolButton } from "@/components/polComponents/PolButton";
import PolIcon from "@/components/PolIcon";
import PolInput from "@/components/polComponents/PolInput";
import { Moment } from "moment";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ComponentHeader } from "@/components/text/ComponentHeader";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { Project } from "@/sdk/entities/project/Project";
import PolCheckbox from "@/components/polComponents/PolCheckbox";
import PolDrawer from "@/components/polComponents/PolDrawer";

const customers: string[] = [
  "Blind Spots Inc.",
  "Dispatcher Inc.",
  "ACME SRL",
  "Novelty I.S",
  "Beauty Clinic SRL",
  "Division Inc.",
];

export interface Filters {
  name?: string;
  startDate?: Moment;
  endDate?: Moment;
  projectIds?: string[];
}

interface InvoiceListSidebarProps {
  container?: HTMLDivElement | null;
  filters?: Filters;
  group?: boolean;
  onClose?: () => void;
  onFiltersChange?: (filters: Filters) => void;
  onGroupChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  open?: boolean;
}

export default function ProjectDatabaseSidebar(props: InvoiceListSidebarProps) {
  const { container, filters = {}, group, onClose, onFiltersChange, onGroupChange, open, ...other } = props;
  const queryRef = useRef<HTMLInputElement | null>(null);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const projects = useDbQuery(Project, "WHERE c.IsActive = true ORDER BY c.Nickname ASC");

  const handleQueryChange = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      console.log("handleQueryChange", queryRef.current?.value);
      event.preventDefault();
      onFiltersChange?.({
        ...filters,
        name: queryRef.current?.value || "",
      });
    },
    [filters, onFiltersChange],
  );

  const handleStartDateChange = useCallback(
    (date: Moment): void => {
      const newFilters: Filters = {
        ...filters,
        startDate: date || undefined,
      };

      // Prevent end date to be before start date
      if (newFilters.endDate && date && date > newFilters.endDate) {
        newFilters.endDate = date;
      }

      onFiltersChange?.(newFilters);
    },
    [filters, onFiltersChange],
  );

  const handleEndDateChange = useCallback(
    (date: Moment): void => {
      const newFilters: Filters = {
        ...filters,
        endDate: date || undefined,
      };

      // Prevent start date to be after end date
      if (newFilters.startDate && date && date < newFilters.startDate) {
        newFilters.startDate = date;
      }

      onFiltersChange?.(newFilters);
    },
    [filters, onFiltersChange],
  );

  const handleCustomerToggle = useCallback(
    (value: boolean, projectId: string): void => {
      let customers: string[];

      if (value) {
        customers = [...(filters.projectIds || []), projectId];
      } else {
        customers = (filters.projectIds || []).filter((x) => x !== projectId);
      }

      onFiltersChange?.({
        ...filters,
        projectIds: customers,
      });
    },
    [filters, onFiltersChange],
  );

  const content = (
    <div className="p-5">
      <div className="mb-14 flex items-center justify-between">
        <PolHeading size={2}>Filters</PolHeading>
        {!lgUp && (
          <PolButton variant="ghost" className="aspect-square rounded-full" onClick={onClose}>
            <PolIcon name="X"></PolIcon>
          </PolButton>
        )}
      </div>
      <div className="flex w-full flex-col space-y-5">
        <form onSubmit={handleQueryChange}>
          <PolInput
            ref={queryRef}
            type="text"
            placeholder="Name"
            className="pl-10"
            overlayElement={<PolIcon name="search" source="google" className="m-auto  ml-2 " />}
          />
        </form>
        <div className="my-5 w-full">
          <ComponentHeader className="text-left">Active Date</ComponentHeader>

          <div className="w-full space-y-2">
            <PolInput label="From" type="date" onValueChanged={handleStartDateChange} value={filters.startDate} />
            <PolInput label="To" type="date" onValueChanged={handleEndDateChange} value={filters.endDate} />
          </div>
        </div>
        <div>
          <ComponentHeader className="text-left">Projects</ComponentHeader>

          <div className="rounded border bg-slate-100">
            <ScrollArea containerClassName="h-[200px]">
              <FormGroup
                sx={{
                  py: 1,
                  px: 1.5,
                }}
              >
                {projects.data?.map((project) => {
                  const isChecked = filters.projectIds?.includes(project.id);

                  return (
                    <PolCheckbox
                      className="m-2"
                      value={isChecked}
                      onValueChanged={(e) => handleCustomerToggle(e, project.id)}
                      key={project.id}
                    >
                      {project.Nickname}
                    </PolCheckbox>
                  );
                })}
              </FormGroup>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );

  if (lgUp) {
    return (
      <PolDrawer
        anchor="left"
        className={open ? "z-10" : ""}
        open={open}
        PaperProps={{
          className: "shadow-gray-200",
          elevation: 16,
          sx: {
            border: "none",
            borderRadius: 2.5,
            overflow: "hidden",
            position: "relative",
            width: 380,
            maxWidth: "90dvw",
          },
        }}
        SlideProps={{ container }}
        variant="persistent"
        sx={{ p: 3 }}
        {...other}
      >
        {content}
      </PolDrawer>
    );
  }

  return (
    <PolDrawer
      anchor="left"
      open={open}
      className="z-10"
      PaperProps={{
        elevation: 16,
        sx: {
          border: "none",
          borderRadius: 2.5,
          overflow: "hidden",
          position: "relative",
          width: 380,
          maxWidth: "90dvw",
        },
      }}
      SlideProps={{ container }}
      variant={lgUp ? "persistent" : "temporary"}
      sx={{ p: 3 }}
      {...other}
    >
      {content}
    </PolDrawer>
  );
}

ProjectDatabaseSidebar.propTypes = {
  container: PropTypes.any,
  // @ts-ignore
  filters: PropTypes.object,
  group: PropTypes.bool,
  onClose: PropTypes.func,
  onFiltersChange: PropTypes.func,
  onGroupChange: PropTypes.func,
  open: PropTypes.bool,
};
