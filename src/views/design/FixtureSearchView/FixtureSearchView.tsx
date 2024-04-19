import { EntityAttachmentViewer } from "@/components/EntityAttachmentViewer";
import { SelectionArea } from "@/components/SelectionArea";
import { PolButton } from "@/components/polComponents/PolButton";
import PolHeading from "@/components/polComponents/PolHeading";
import PolInput from "@/components/polComponents/PolInput";
import PolModal from "@/components/polComponents/PolModal";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolText from "@/components/polComponents/PolText";
import { Seo } from "@/components/polComponents/Seo";
import { SelectedFixturesContext, SelectedFixturesProvider } from "@/contexts/SelectedFixturesContext";
import { useDbInfiniteQuery } from "@/customHooks/sdkHooks/UseDbInfiniteQuery";
import useScrollPosition from "@/customHooks/useScrollPosition";
import { useSearchParamState } from "@/customHooks/useSearchParamState";
import { Fixture } from "@/sdk/entities/design/Fixture";
import { FixtureEditor } from "@/views/design/FixtureSearchView/fixtures/FixtureEditor";
import { ContentQuality } from "@sdk/./contracts/Entity";
import { isNullOrWhitespace, sanitizeInput } from "@sdk/./utils/stringUtils";
import { useEffect, useRef, useState } from "react";
import CreateNewFixture from "./CreateNewFixture";
import "./FixtureSearchView.module.css";
import PolIcon from "@/components/PolIcon";

export default function FixtureSearchView() {
  const [searchText, setSearchText] = useSearchParamState("q", "");
  const [currentSearchText, setCurrentSearchText] = useState(searchText);
  const sanitizedSearchText = sanitizeInput(searchText);
  const query = isNullOrWhitespace(sanitizedSearchText)
    ? ""
    : `Search c.Title Contains '${sanitizedSearchText}' AND c.ManufacturerName Contains '${sanitizedSearchText}' AND c.Url Contains '${sanitizedSearchText}' AND c.Description Contains '${sanitizedSearchText}' AND c.Tags Contains '${sanitizedSearchText}'`;
  const response = useDbInfiniteQuery(Fixture, query, 50);

  const scrollPosition = useScrollPosition();
  const isLoading = useRef(false);

  useEffect(() => {
    const isAtBottom = scrollPosition.scrollHeight - scrollPosition.scrollY < 200;
    if (isAtBottom && isLoading.current == false) {
      isLoading.current = true;
      response.fetchNextPage().then((x) => {
        isLoading.current = false;
      });
    }
  }, [scrollPosition]);

  return (
    <>
      <Seo title="Fixture Catalog" />
      <div className="page-header header-Container top-[48px] grid grid-flow-col grid-cols-[1fr_auto] p-2">
        <PolInput
          data-testid="searchInput"
          placeholder="Search"
          value={currentSearchText}
          onValueChanged={(e) => setCurrentSearchText(e)}
          onBlur={(e) => setSearchText(e.target.value)}
          onKeyPress={(e) => (e.key == "Enter" ? setSearchText(e.currentTarget.value) : {})}
          type="search"
          className="h-8"
        />
        <PolModal
          data-testid="createModal"
          modalTrigger={
            <PolButton className="m-auto ml-3 h-8" data-testid="createButton">
              <PolIcon name="Upload" stroke="white" />
            </PolButton>
          }
        >
          <CreateNewFixture></CreateNewFixture>
        </PolModal>
      </div>
      <style>
        {`.selection-area-container {
                align-content: baseline;
                padding-top: 10px;
                align-items: center;
                margin: auto;
                }
            `}
      </style>

      <div className="card-1 absolute top-[50px] grid w-full">
        <PolRequestPresenter
          containerClassName=" grid grid-cols-[1fr_auto]"
          request={response}
          onSuccess={() => (
            <SelectedFixturesProvider Items={response.data.pages.flatMap((x) => x.Items)}>
              <SelectionArea
                className="grid w-full grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] p-2 max-sm:grid-cols-[repeat(auto-fill,_minmax(50%,_1fr))]"
                Context={SelectedFixturesContext}
                SelectedItemClassName="scale-105 hover:scale-105 shadow-lg shadow-blue-200 ring-2 "
                ItemTemplateClassName="card-2 p-2.5 m-2.5 duration-100 cursor-pointer hover:scale-105"
                ItemTemplate={(x) => {
                  return (
                    <>
                      <EntityAttachmentViewer
                        entity={x}
                        quality={ContentQuality.Thumbnail}
                        viewerClassName="rounded-md min-h-24"
                      ></EntityAttachmentViewer>
                      <PolText type="muted" className="font-semibold">
                        {x.Name}
                      </PolText>
                    </>
                  );
                }}
              >
                {response.currentPage == response.data.pages[0].PageCount && (
                  <div className="m-auto my-3 rounded-md border bg-slate-300 p-2">
                    <PolHeading size={4} className="m-auto">
                      No more results
                    </PolHeading>
                  </div>
                )}
              </SelectionArea>
              <FixtureEditor></FixtureEditor>
            </SelectedFixturesProvider>
          )}
        />
      </div>
    </>
  );
}
