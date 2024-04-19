import { Client } from "@/sdk/entities/project/Client";

export interface ClientFormProps {
  client: Client;
  updateClient: (project: Partial<Client>) => void;
}
