import { Entity } from "../../contracts/Entity";
import { EntityType } from "../../sdkconfig/EntityTypeId";

@EntityType("beec9ec9-ecf4-4645-9e87-fe5d14173338")
export class Client extends Entity {
  DisplayName: string;
  CompanyName: string;
  Abbreviation: string;
  LogoId: string;
  ShowInTimesheet: boolean;
}
