import { DocumentLineItem } from "@/sdk/entities/project/DocumentLineItem";
import { AnyProjectDocument, ProjectDocument } from "@/sdk/entities/project/ProjectDocument";
import { tryGetSum } from "@sdk/./utils/arrayUtils";
import { toUsdString } from "@sdk/./utils/moneyUtils";

interface Props<T> {
  Documents: T[];
  Title: string;
}
export function ProjectDocumentAccordionHeader<T extends ProjectDocument<DocumentLineItem>>({
  Documents,
  Title,
}: Props<T>) {
  return (
    <div className="grid w-full grid-flow-col">
      <h4 className="text-left">
        {Title} ({Documents.length})
      </h4>
      <h4 className="mx-2 text-right">
        {toUsdString(tryGetSum(Documents.flatMap((x) => x.Phases.map((x) => x.AmountAllotted))))}
      </h4>
    </div>
  );
}
