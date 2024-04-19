import { NewProjectFormItemProps } from "@/views/projects/CreateNewProjectForm/NewProjectFormItemProps";
import PolHeading from "@/components/polComponents/PolHeading";

export default function NewProjectReview({ project }: NewProjectFormItemProps) {
  return (
    <>
      <PolHeading size={2}>{project.Nickname}</PolHeading>
    </>
  );
}
