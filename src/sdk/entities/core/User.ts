import { Moment } from "moment/moment";
import { Entity } from "../../contracts/Entity";
import { EmployeeStatus } from "../../models/EmployeeStatus";
import { Person } from "../../models/Person";
import { EntityType } from "../../sdkconfig/EntityTypeId";

@EntityType("6480c255-8f52-4cc7-b2e5-6b9838e3ad7f")
export class User extends Entity {
  ProfileAttachmentId: string;
  PositionTitle: string;
  OfficeId: string;
  Extension: string;
  Person: Person;
  Status: EmployeeStatus;
  StatusReason: string;
  IdentityId: string;
  AcceptTokenFrom: Moment;
  Access: number[];
  IntroVideoId: string;
}
