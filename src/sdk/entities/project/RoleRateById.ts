import { ChildEntity } from "../../contracts/ChildEntity";

export class RoleRateById extends ChildEntity {
  RoleId: string;
  Rate: number;
}

export class RoleRateByTitle extends ChildEntity {
  Title: string;
  Rate: number;
}
