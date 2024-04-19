import { ChildEntity } from "../../../contracts/ChildEntity";

export class Weight extends ChildEntity {
  Value: Number;
  Unit: UnitOfMass;
  IsEstimate: boolean;
}

export enum UnitOfMass {
  Pounds,
  Kilograms,
}
