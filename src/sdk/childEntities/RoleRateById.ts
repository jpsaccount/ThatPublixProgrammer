import { ChildEntity } from "../contracts/ChildEntity";

export class RoleRateById extends ChildEntity {
  RoleId: string = "";
  Rate: number;
}
