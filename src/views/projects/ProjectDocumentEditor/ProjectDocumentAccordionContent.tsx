import { DocumentLineItem } from "@/sdk/entities/project/DocumentLineItem";
import { ProjectDocument } from "@/sdk/entities/project/ProjectDocument";
import { tryGetSum } from "@/sdk/utils/arrayUtils";
import { toUsdString } from "@sdk/./utils/moneyUtils";
import { isNullOrWhitespace } from "@sdk/./utils/stringUtils";
interface Props<T> {
  Documents: T[];
  onClick?: (item: any) => void;
}
export function ProjectDocumentAccordionContent<T extends ProjectDocument<DocumentLineItem>>({
  Documents,
  onClick,
}: Props<T>) {
  return (
    <div className="grid grid-flow-row border-t">
      {Documents.map((x) => (
        <button
          onClick={() => {
            onClick(x);
          }}
          className="p-1 pr-6 hover:bg-background-100"
        >
          <div className="grid w-full grid-flow-col">
            <h4 className="text-left">{isNullOrWhitespace(x.Nickname) ? x.Title : x.Nickname}</h4>
            <h4 className="text-right">{toUsdString(tryGetSum(x.Phases.map((x) => x.AmountAllotted)))}</h4>
          </div>
        </button>
      ))}
    </div>
  );
}
