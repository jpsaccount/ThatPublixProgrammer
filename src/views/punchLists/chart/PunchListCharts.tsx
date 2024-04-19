import { PunchList } from "@/sdk/entities/punchList/PunchList";
import React from "react";
import PunchListsPieChart from "./PieChart";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { PunchListItem } from "@/sdk/entities/punchList/PunchListItem";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import BarChart from "./BarChart";
import PolHeading from "@/components/polComponents/PolHeading";
import ByUserBarChart from "./ByUserBarChart";
import PunchListContainer from "./PunchListContainer";

interface Props {
  punchLists: PunchList[];
  onIsLoadingChange: (val: boolean) => void;
}

export default function PunchListCharts({ punchLists, onIsLoadingChange }: Props) {
  const punchListItems = useDbQuery(
    PunchListItem,
    `WHERE c.PunchListId IN [${punchLists.map((list) => `"` + list.id + `"`)}]`,
  );
  return (
    <span>
      <PolRequestPresenter
        containerClassName="flex justify-center gap-4"
        request={punchListItems}
        onSuccess={() => (
          <>
            <div className="flex max-w-[1200px] flex-grow flex-col gap-4">
              <div className="flex gap-4">
                <div className="w-1/3 rounded shadow-md transition-all hover:scale-[1.01] hover:shadow-lg">
                  <div className="mb-2 flex  w-full bg-gray-100 p-2">
                    <PolHeading size={4}>Status</PolHeading>
                  </div>
                  <div className="p-2">
                    <PunchListsPieChart
                      punchListItems={punchListItems.data}
                      punchLists={punchLists}
                    ></PunchListsPieChart>
                  </div>
                </div>
                <div className="w-2/3 rounded shadow-md transition-all hover:scale-[1.01] hover:shadow-lg">
                  <div className="mb-2 flex  w-full bg-gray-100 p-2">
                    <PolHeading size={4}>Punch Lists</PolHeading>
                  </div>
                  <div className="p-2">
                    <BarChart punchListItems={punchListItems.data} punchLists={punchLists}></BarChart>
                  </div>
                </div>
              </div>
              <div className="rounded shadow-md transition-all hover:scale-[1.01] hover:shadow-lg">
                <div className="mb-2 flex  w-full bg-gray-100 p-2">
                  <PolHeading size={4}>Users</PolHeading>
                </div>
                <div className="p-2">
                  <ByUserBarChart punchListItems={punchListItems.data} punchLists={punchLists}></ByUserBarChart>
                </div>
              </div>
            </div>
            <div className="flex w-fit flex-col">
              <PunchListContainer
                onIsLoadingChange={onIsLoadingChange}
                refetch={punchListItems.refetch}
                punchLists={punchLists}
                punchListItems={punchListItems.data}
              ></PunchListContainer>
            </div>
          </>
        )}
      ></PolRequestPresenter>
    </span>
  );
}
