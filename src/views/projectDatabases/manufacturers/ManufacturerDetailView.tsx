import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import PolHeading from "@/components/polComponents/PolHeading";
import PolInput from "@/components/polComponents/PolInput";
import PolMutationErrorPresenter from "@/components/polComponents/PolMutationErrorPresenter";
import { Seo } from "@/components/polComponents/Seo";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAlert } from "@/contexts/AlertContext";
import { useDbDelete } from "@/customHooks/sdkHooks/useDbDelete";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { Manufacturer } from "@/sdk/entities/project/equipment/Manufacturer";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { Dropdown } from "flowbite-react";
import { useEffect, useState } from "react";

interface Props {
  selectedManufacturer: Manufacturer;
  onSelectedManufacturerChange: (manufacturer: Manufacturer) => void;
}

export default function ManufacturerDetailView({ selectedManufacturer, onSelectedManufacturerChange }: Props) {
  // const { id } = useParams();
  const id = "";
  const navigate = usePolNavigate();
  const manufacturer = useDbQueryFirst(Manufacturer, `WHERE c.id = "${id}"`);
  const saveManufacturerMutation = useDbUpsert(Manufacturer);
  const deleteMutation = useDbDelete(Manufacturer);

  const alert = useAlert();

  async function deleteClient() {
    const result = await alert.showAlert({
      title: "Confirmation",
      description:
        "Are you sure you want to delete this client. Deleting this client will remove all projects and anything associated to the projects. This action cannot be undone.",
    });
    if (result === false) return;
    await deleteMutation.mutateAsync(manufacturer.data);
    navigate({ to: "/clients" });
  }

  const [value, setValue] = useState(selectedManufacturer);

  useEffect(() => {
    setValue(selectedManufacturer);
  }, [selectedManufacturer]);

  const handleClose = () => {
    onSelectedManufacturerChange(null);
  };

  return (
    <>
      <Seo title={manufacturer.data?.Name ?? "Manufacturer Editor"} />
      <Sheet onOpenChange={handleClose} open={isUsable(selectedManufacturer)}>
        <SheetContent>
          <div className="mx-auto grid grid-flow-row space-y-2 p-5 md:w-1/2">
            <div className="mb-2 mt-1 grid grid-flow-col">
              <div className="w-fit">
                <Dropdown
                  className="z-[10000] w-fit"
                  arrowIcon={false}
                  inline
                  label={<PolIcon data-testid="moreOptionsIcon" name="MoreVertical"></PolIcon>}
                >
                  <Dropdown.Item className="rounded-lg" onClick={deleteClient}>
                    Delete
                  </Dropdown.Item>
                </Dropdown>
              </div>
              <PolHeading size={3}>Manufacturer Editor</PolHeading>
            </div>
            <PolInput
              label="Name"
              value={value?.Name}
              onValueChanged={(value) => setValue((x) => ({ ...x, Name: value }))}
            />

            <PolInput
              label="Nickname"
              value={value?.CodeName}
              onValueChanged={(value) => setValue((x) => ({ ...x, CodeName: value }))}
            />

            <PolInput
              label="Notes"
              value={value?.Notes}
              onValueChanged={(value) => setValue((x) => ({ ...x, Notes: value }))}
            />

            <PolMutationErrorPresenter mutation={saveManufacturerMutation} />
            <PolButton
              className="mx-auto w-fit"
              onClick={() => saveManufacturerMutation.mutateAsync(value).then(handleClose)}
            >
              Save
            </PolButton>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
