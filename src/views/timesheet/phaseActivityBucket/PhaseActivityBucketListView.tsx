import PolIcon from "@/components/PolIcon";
import EntityTableView from "@/components/polComponents/EntityTableViews/EntityTableView";
import { PolButton } from "@/components/polComponents/PolButton";
import PolInput from "@/components/polComponents/PolInput";
import PolModal from "@/components/polComponents/PolModal";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { Seo } from "@/components/polComponents/Seo";
import useDbCaching from "@/customHooks/sdkHooks/useDbCaching";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { PhaseActivityBucket } from "@/sdk/entities/billing/PhaseActivityBucket";
import { useState } from "react";

export default function PhaseActivityBucketListView() {
  const phaseActivityBucketRequest = useDbQuery(PhaseActivityBucket);

  const navigate = usePolNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [newPhaseActivityBucket, setNewPhaseActivityBucket] = useState(new PhaseActivityBucket());

  const upsert = useDbUpsert(PhaseActivityBucket);
  const { setToQuery: addToCache } = useDbCaching();

  function updateClient(project: Partial<PhaseActivityBucket>) {
    setNewPhaseActivityBucket((x) => {
      return { ...x, ...project };
    });
  }

  const createPhaseActivityBucket = async () => {
    try {
      await upsert.mutateAsync(newPhaseActivityBucket);
      addToCache(PhaseActivityBucket, newPhaseActivityBucket);
      navigate({ to: "/timesheet/dropdowns/$id", params: { id: newPhaseActivityBucket.id } });
      setNewPhaseActivityBucket(new PhaseActivityBucket());
      return true;
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Seo title="Time Activity Dropdowns" />
      <PolModal isOpen={isOpen} onOpenChanged={setIsOpen}>
        <div className="grid grid-flow-row gap-2">
          <PolInput
            label="Title"
            value={newPhaseActivityBucket.Title}
            onValueChanged={(value) => updateClient({ Title: value })}
          />
          <PolInput
            label="Description"
            value={newPhaseActivityBucket.Description}
            onValueChanged={(value) => updateClient({ Description: value })}
          />
          <PolButton className="mx-auto mt-2 w-fit" onClick={createPhaseActivityBucket}>
            Save
          </PolButton>
        </div>
      </PolModal>
      <PolRequestPresenter
        request={phaseActivityBucketRequest}
        onSuccess={() => (
          <div className="min-md:w-[60dvw] m-auto mt-1 flex h-full flex-col">
            <PolButton className=" m-2 ml-auto" data-testid={"create-button"} onClick={() => setIsOpen(true)}>
              <PolIcon name="Plus" stroke="white"></PolIcon>
            </PolButton>
            <EntityTableView<PhaseActivityBucket>
              emptyView={"No phase activity buckets exists. Create your first one!"}
              onRowClicked={(x) => navigate({ to: "/timesheet/dropdowns/$id", params: { id: x.id } })}
              data={phaseActivityBucketRequest.data}
              dense={false}
              columns={[{ id: "Title" }]}
              orderByProperty="Title"
              mobileRowTemplate={(x, index, props) => {
                return (
                  <>
                    <div
                      className="mobile-card-item grid grid-flow-col"
                      onClick={() => navigate({ to: "/timesheet/dropdowns/$id", params: { id: x.id } })}
                      tabIndex={-1}
                      key={x.id}
                      {...props}
                    >
                      <div className="grid grid-flow-row text-left ">
                        <span className="font-medium">{x.Title}</span>
                      </div>
                      <div className="my-auto ml-auto mr-0 text-right">
                        <span className="font-medium">{x.Description}</span>
                      </div>
                    </div>
                  </>
                );
              }}
            />
          </div>
        )}
      />
    </>
  );
}
