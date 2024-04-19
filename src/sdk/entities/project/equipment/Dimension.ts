import { ChildEntity } from "../../../contracts/ChildEntity";
import { UnitOfMeasurement } from "./UnitOfMeasurement";

export class Dimension extends ChildEntity {
  Width: Number;
  Height: Number;
  Depth: Number;
  UnitOfMeasurement: UnitOfMeasurement;
}
