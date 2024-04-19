import { Entity } from "../../contracts/Entity";
import { EntityType } from "../../sdkconfig/EntityTypeId";
import { Contract, Directive, Proposal } from "./ProposalLineItem";
import { RoleRateByTitle } from "./RoleRateByTitle";

@EntityType("ae59b518-c975-4709-9445-cb14377809e7")
export class Project extends Entity {
  Databases: string[];
  DefaultRoleRateByTitle: RoleRateByTitle[] = [];
  Directives: Directive[] = [];
  Contracts: Contract[] = [];
  Proposals: Proposal[] = [];
  IsClosed: boolean;
  IsInternal: boolean;
  Nickname: string;
  StatusID: string;
  ContractNumber: string;
  AttractionName: string;
  Name: string;
  ClientId: string;
  QboProjectName: string;
  ShowInTimesheet: boolean;
  IsActive: boolean;
  IsBillable: boolean;
}
