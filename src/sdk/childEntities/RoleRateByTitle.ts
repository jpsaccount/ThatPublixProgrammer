import { ChildEntity } from "../contracts/ChildEntity";

export class RoleRateByTitle extends ChildEntity {
  Rate: number;
  Title: string = "";
}
