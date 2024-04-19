import { createContext } from "react";
import { Client } from "@/sdk/entities/project/Client";
import { Project } from "@/sdk/entities/project/Project";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import { Role } from "@sdk/./entities/billing/Role";
import { Task } from "@sdk/./entities/billing/Task";
import { SubTask } from "@sdk/./entities/billing/SubTask";

export class TimeActivityDropdowns {
  Clients: Client[];
  Projects: Project[];
  WorkingPhases: WorkingPhase[];
  Roles: Role[];
  Tasks: Task[];
  SubTasks: SubTask[];
}

export const TimeActivityDropdownContext = createContext(new TimeActivityDropdowns());
