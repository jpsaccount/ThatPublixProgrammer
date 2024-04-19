import { Moment } from "moment";
import { ChildEntity } from "../../../contracts/ChildEntity";

export class Cost extends ChildEntity {
  IsCostEstimated: boolean;
  Usd: number;
  CostAsOf: Moment;
}
