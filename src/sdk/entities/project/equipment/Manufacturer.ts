import { Moment } from "moment";
import { Entity } from "../../../contracts/Entity";
import { Person } from "../../../models/Person";
import { EntityType } from "../../../sdkconfig/EntityTypeId";

@EntityType("76e6fdb4-d8a0-4403-83ed-dba007623be9")
export class Manufacturer extends Entity {
  Name: string = "";
  Website: string = "";
  State: string = "";
  Notes: string = "";
  CatalogRecieved: Moment;
  ContactPerson: Person;
  CodeName: string = "";
  Tags: string[];
}
