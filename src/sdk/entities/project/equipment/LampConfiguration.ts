import { ChildEntity } from "../../../contracts/ChildEntity";

export class LampConfiguration extends ChildEntity {
  Lamp1Qty: number;
  IsLamp1Inc: boolean;
  IsLamp1Na: boolean;
  Lamp2Qty: number;
  IsLamp2Inc: boolean;
  IsLamp2Na: boolean;
  IsIntegral: boolean;
  IsIntegralDmx: boolean;
}
