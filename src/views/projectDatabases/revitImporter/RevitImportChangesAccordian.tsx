import { PolButton } from "@/components/polComponents/PolButton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RevitChangeType } from "@/sdk/entities/project/equipment/revit/RevitChangeType";
import { RevitEquipmentUnitChange } from "@/sdk/entities/project/equipment/revit/RevitEquipmentUnitChange";
import { RevitImport } from "@/sdk/entities/project/equipment/revit/RevitImport";

interface Props {
  revitImport: RevitImport;
  changes: RevitEquipmentUnitChange[];
}

const RevitImportChangesAccordian = ({ revitImport, changes }: Props) => {
  const modifiedChanges: RevitEquipmentUnitChange[] = changes.filter(
    (change) => change.ChangeType === RevitChangeType.Modified,
  );

  const deletedChanges: RevitEquipmentUnitChange[] = changes.filter(
    (change) => change.ChangeType === RevitChangeType.Deleted,
  );

  const addedChanges: RevitEquipmentUnitChange[] = changes.filter(
    (change) => change.ChangeType === RevitChangeType.Added,
  );

  return (
    <Accordion collapsible type="single" className="border rounded-md mt-4 p-5">
      <AccordionItem value="changed">
        <AccordionTrigger className="border-t">{`Changed ${modifiedChanges.length}`}</AccordionTrigger>
        <AccordionContent className="max-h-[500px] overflow-auto">
          {modifiedChanges.map((change) => (
            <div key={change.EquipmentUnitId}>
              <Collapsible className="w-full">
                <CollapsibleTrigger className="w-full">
                  <PolButton variant="ghost" className="w-full">
                    {`Equipment Unit: ${change.EquipmentUnitTitle}`}
                  </PolButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="max-h-[500px] overflow-auto border-t border-b">
                  {change.PropertiesChanged.map((propertyChange) => (
                    <p key={propertyChange.PropertyName}>
                      {`${propertyChange.PropertyName}: "${propertyChange.PreviousValue}" to "${propertyChange.NewValue}"`}
                    </p>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="deleted">
        <AccordionTrigger>{`Deleted ${deletedChanges.length}`}</AccordionTrigger>
        <AccordionContent className="max-h-[500px] overflow-auto">
          {deletedChanges.map((change) => (
            <p key={change.EquipmentUnitId}>Deleted Equipment Unit: {`${change.EquipmentUnitTitle}`}</p>
          ))}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="added">
        <AccordionTrigger>{`Added ${addedChanges.length}`}</AccordionTrigger>
        <AccordionContent className="max-h-[500px] overflow-auto">
          {addedChanges.map((change) => (
            <div key={change.EquipmentUnitId}>
              <p>Added Equipment Unit: {`${change.EquipmentUnitTitle}`}</p>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default RevitImportChangesAccordian;
