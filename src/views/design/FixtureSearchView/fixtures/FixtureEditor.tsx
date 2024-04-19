import { EntityAttachmentViewer } from "@/components/EntityAttachmentViewer";
import PolModal from "@/components/polComponents/PolModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SelectedFixturesContext } from "@/contexts/SelectedFixturesContext";
import { Fixture } from "@/sdk/entities/design/Fixture.js";
import { ContentQuality } from "@sdk/./contracts/Entity.js";
import { isSmallDevice } from "@sdk/./utils/deviceUtils";
import { getAttachmentContentUrl } from "@sdk/./utils/entityUtils";
import { isUsable } from "@sdk/./utils/usabilityUtils";
import { useContext, useEffect, useState } from "react";

import { PolButton } from "@/components/polComponents/PolButton";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import PolHeading from "../../../../components/polComponents/PolHeading";
import PolInput from "../../../../components/polComponents/PolInput";
import PolText from "../../../../components/polComponents/PolText";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../components/ui/tooltip";
import PolIcon from "@/components/PolIcon";

interface Props {
  OnClose?: () => void;
}

export function FixtureEditor({ OnClose }: Props) {
  const { SelectedItems, RemoveItem, UpdateItem } = useContext(SelectedFixturesContext);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFixture, setSelectedFixture] = useState<Fixture>(null);
  useEffect(() => {
    setSelectedFixture(SelectedItems.length == 1 ? SelectedItems[0] : null);
  }, [SelectedItems]);

  const mutation = useDbUpsert(Fixture, {
    onSuccess: (data) => {
      UpdateItem(data);
      setIsEditing(false);
    },
  });

  const control = () => (
    <>
      <style>
        {`   .but{
            padding: .5rem;
            color: white;
            background: #222;
            border-radius: 3px;
            min-width: 5rem;
            margin: auto 0 0 0;
            width: 50%;
        }
            .but:hover{
            background: #444;
        }

            .search-detail-container{ overflow: auto;
            display: flex; flex-direction: column; gap: 1rem; padding: 1rem;
            align-items: start; position: sticky; top:125px;
        }

            .picture{
            max-width: 450px;
            margin: 0 auto;
            max-height: 385px;
            display: block;
            object-fit: contain;
        }

            .content-viewer{
            max-width: calc(100dvw - 50px); max-height: 350px; margin: auto;
        }



            .add{
            padding: .5rem;
            color: white;
            background: #222;
            border-radius: 3px;
            min-width: 5rem;
            margin: 0;
        }
            .add:hover{
            background: #444;
        }
            .e-chip-set{
            box-sizing: border-box;
            justify-content: center;
            display: flex;
            flex-wrap: wrap;
            width: 300px;
        }
`}
      </style>
      <div className="bg-background-50">
        <div className="search-detail-container h-[80dvh] w-[450px] rounded-lg p-5 max-sm:h-[100dvh]  max-sm:w-[100dvw]">
          <div className="flex w-full flex-row items-center justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger className="h-fit" aria-label="dropdownTrigger">
                <PolIcon name="MoreVertical"></PolIcon>
              </DropdownMenuTrigger>
              <DropdownMenuContent aria-label="moreOptions">
                <DropdownMenuItem>
                  <button
                    className="h-full w-full text-left"
                    data-testid="editButton"
                    style={{ cursor: "pointer" }}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel Edit" : "Edit"}
                  </button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem style={{ cursor: "pointer" }}>Favorite</DropdownMenuItem>
                <DropdownMenuItem style={{ cursor: "pointer" }}>Save to catalog</DropdownMenuItem>
                <DropdownMenuItem style={{ cursor: "pointer" }}>Share</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem style={{ cursor: "pointer" }}>Report</DropdownMenuItem>
                <DropdownMenuItem style={{ cursor: "pointer" }}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex">
              <div className="flex items-center justify-between rounded-lg bg-blue-600 p-2">
                <a
                  href={selectedFixture.Url}
                  title="Open fixture url"
                  target="_blank"
                  className="flex items-center justify-center"
                >
                  <PolIcon name="ExternalLink" stroke="white" size={"20px"}></PolIcon>
                </a>
                <div className="mx-2 h-[100%] border"></div>
                <a
                  data-testid="googleSearch"
                  href={`https://www.google.com/search?q=${
                    selectedFixture.ManufacturerName + " " + selectedFixture.Name
                  }`}
                  title="Google search fixture"
                  target="_blank"
                  className="flex items-center justify-center"
                >
                  <PolIcon name="Search" stroke="white " size={"20px"} className=""></PolIcon>
                </a>{" "}
                <div className="mx-2 h-[100%] border"></div>
                <a
                  data-itemid="scanSearch"
                  href={`https://lens.google.com/uploadbyurl?url=${getAttachmentContentUrl(
                    Fixture,
                    selectedFixture,
                    ContentQuality.Original,
                  )}`}
                  title="Google Lens search"
                  target="_blank"
                  className="flex items-center justify-center"
                >
                  <PolIcon name="ScanSearch" stroke="white" size={"20px"} className="m-0"></PolIcon>
                </a>
              </div>
            </div>
            <PolButton variant="ghost" onClick={() => RemoveItem(selectedFixture)}>
              <PolIcon name="X"></PolIcon>
            </PolButton>
          </div>
          <div className="flex flex-col justify-between gap-1">
            <EntityAttachmentViewer
              downloadable={true}
              downloadFileName={selectedFixture.Name}
              entity={selectedFixture}
              quality={ContentQuality.Original}
            />
            <div>
              {!isEditing ? (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <PolHeading
                          data-testid="fixture-name"
                          size={4}
                          className="mt-4"
                        >{`${selectedFixture.Name} - ${selectedFixture.ManufacturerName}`}</PolHeading>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <div>Name - Manufacture Name</div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <PolText data-testid="description" type="small" className="mt-2 text-start">
                    {selectedFixture.Description}
                  </PolText>
                </>
              ) : (
                <>
                  <PolInput
                    type="text"
                    aria-label="manufacturerInput"
                    label="Manufacturer Name"
                    className="line-clamp-5 min-h-[25px] text-left"
                    value={selectedFixture.ManufacturerName}
                    onValueChanged={(value) =>
                      setSelectedFixture({
                        ...selectedFixture,
                        ManufacturerName: value,
                      })
                    }
                  />
                  <PolInput
                    aria-label="nameInput"
                    label="Title"
                    type=""
                    className="line-clamp-5 min-h-[25px] text-left"
                    value={selectedFixture.Name}
                    onValueChanged={(value) => setSelectedFixture({ ...selectedFixture, Name: value })}
                  />
                  <PolInput
                    aria-label="descriptionInput"
                    label="Description"
                    className="line-clamp-5 min-h-[25px] text-left"
                    type=""
                    isMultiline={true}
                    value={selectedFixture.Description}
                    onValueChanged={(value) =>
                      setSelectedFixture({
                        ...selectedFixture,
                        Description: value,
                      })
                    }
                  />
                  <PolInput
                    aria-label="urlInput"
                    label="Url"
                    type=""
                    className="line-clamp-5 min-h-[25px] text-left"
                    value={selectedFixture.Url}
                    onValueChanged={(value) => setSelectedFixture({ ...selectedFixture, Url: value })}
                  />
                </>
              )}
            </div>
          </div>
          {isEditing && <PolButton onClick={() => mutation.mutateAsync(selectedFixture)}>Save</PolButton>}
        </div>
      </div>
    </>
  );

  if (isSmallDevice()) {
    return (
      <PolModal className="gap-0 p-0" showCloseButton={false} isOpen={isUsable(selectedFixture)}>
        {isUsable(selectedFixture) && control()}
      </PolModal>
    );
  }
  return isUsable(selectedFixture) && control();
}
