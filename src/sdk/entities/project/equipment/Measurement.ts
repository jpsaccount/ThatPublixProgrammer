import { ChildEntity } from "../../../contracts/ChildEntity";
import { Dimension } from "./Dimension";
import { Weight } from "./Weight";

export class Measurement extends ChildEntity {
  Weights: Weight[];
  Dimensions: Dimension[];
}
