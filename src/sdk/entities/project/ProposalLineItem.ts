import { DocumentLineItem } from "./DocumentLineItem";
import { ProjectDocument } from "./ProjectDocument";

export class Proposal extends ProjectDocument<ProposalLineItem> {
  SentTo: string;
}
export class ProposalLineItem extends DocumentLineItem {}

export class Directive extends ProjectDocument<DirectiveLineItem> {
  SentTo: string;
}

export class DirectiveLineItem extends DocumentLineItem {}

export class Contract extends ProjectDocument<ContractLineItem> {
  IsChangeOrder: boolean = false;
  BaseContractID: string = "";
  TermID: number = 0;
  CollectsRetainage: boolean = false;
  RetainagePercent: number = 0;
}

export class ContractLineItem extends DocumentLineItem {}
