import { Entity } from "../../contracts/Entity";
import { Address } from "../../models/Address";
import { Person } from "../../models/Person";

export class Company extends Entity {
  CompanyName: string = "";
  DisplayName: string = "";
  BillingAddress: Address;
  CompanyAddress: Address;
  Contact: Person;
  PhoneNumber: number;
  Notes: string = "";
  Website: string = "";
  ShowInTimesheet: boolean;
}
