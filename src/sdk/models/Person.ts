import { Address } from "./Address";
import { Name } from "./Name";
import { isNullOrWhitespace } from "../utils/stringUtils";
import { Moment } from "moment/moment";

export class Person {
  HomeAddress: Address;
  LegalName: Name;
  PreferredName: Name;
  DateOfBirth: Moment;
  Emails: Array<string>;
  HomePhone: string;
  CellPhone: string;
  Notes: string;
}
