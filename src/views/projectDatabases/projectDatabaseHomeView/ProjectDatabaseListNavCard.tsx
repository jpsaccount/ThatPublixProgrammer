import PolIcon from "@/components/PolIcon";
import PolHeading from "@/components/polComponents/PolHeading";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import styled from "styled-components";

const ProjectDatabaseCard = styled.a.attrs({
  className:
    "bg-background-50 flex justify-center rounded-lg gap-2 h-36 shadow-md shadow-gray-200 dark:shadow-none border dark:border-gray-600 cursor-pointer hover:scale-[1.02] transition max-sm:col-span-12 max-md:col-span-6 col-span-4",
})``;

export default function ProjectDatabaseListNavCards() {
  const navigate = usePolNavigate();
  return (
    <div className="my-2 gap-4 space-y-4 p-5">
      <div className="grid grid-flow-row grid-cols-12 gap-4">
        <ProjectDatabaseCard onClick={() => navigate({ to: "/equipment" })}>
          <PolIcon name="detector_alarm" source="google" size="5rem" className="my-auto" />
          <PolHeading size={3} className="my-auto">
            Equipment
          </PolHeading>
        </ProjectDatabaseCard>
        <ProjectDatabaseCard onClick={() => navigate({ to: "/equipment-type-groups" })}>
          <PolIcon name="communities" source="google" size="5rem" className="my-auto" />
          <PolHeading size={3} className="my-auto">
            Fixture Config Groups
          </PolHeading>
        </ProjectDatabaseCard>
        <ProjectDatabaseCard onClick={() => navigate({ to: "/gobo" })}>
          <PolIcon name="stroke_full" source="google" size="5rem" className="my-auto" />
          <PolHeading size={3} className="my-auto">
            Patterns
          </PolHeading>
        </ProjectDatabaseCard>
      </div>
      <div className="grid grid-flow-row grid-cols-12 gap-4">
        <ProjectDatabaseCard onClick={() => navigate({ to: "/lamps" })}>
          <PolIcon name="lightbulb" source="google" size="5rem" className="my-auto" />
          <PolHeading size={3} className="my-auto">
            Lamps
          </PolHeading>
        </ProjectDatabaseCard>
        <ProjectDatabaseCard onClick={() => navigate({ to: "/control-components" })}>
          <PolIcon name="tune" source="google" size="5rem" className="my-auto" />
          <PolHeading size={3} className="my-auto">
            Control Components
          </PolHeading>
        </ProjectDatabaseCard>
        <ProjectDatabaseCard onClick={() => navigate({ to: "/datasheets" })}>
          <PolIcon name="description" source="google" size="5rem" className="my-auto" />
          <PolHeading size={3} className="my-auto">
            Datasheets
          </PolHeading>
        </ProjectDatabaseCard>
      </div>

      <div className="grid grid-flow-row grid-cols-12 gap-4">
        <ProjectDatabaseCard onClick={() => navigate({ to: "/manufacturers" })}>
          <PolIcon name="lightbulb" source="google" size="5rem" className="my-auto" />
          <PolHeading size={3} className="my-auto">
            Manufacturer
          </PolHeading>
        </ProjectDatabaseCard>
        <ProjectDatabaseCard onClick={() => navigate({ to: "/equipment-type" })}>
          <PolIcon name="" source="google" size="5rem" className="my-auto" />
          <PolHeading size={3} className="my-auto">
            Equipment Type
          </PolHeading>
        </ProjectDatabaseCard>
      </div>
    </div>
  );
}
