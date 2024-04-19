import { Project } from "@/sdk/entities/project/Project";

export interface NewProjectFormItemProps {
  project: Project;
  updateProject: (project: Partial<Project>) => void;
}
