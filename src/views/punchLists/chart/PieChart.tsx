import React, { useMemo } from "react";
import { PunchList } from "@/sdk/entities/punchList/PunchList";
import { PunchListItem } from "@/sdk/entities/punchList/PunchListItem";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Status } from "@/sdk/enums/Status";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  punchLists: PunchList[];
  punchListItems: PunchListItem[];
}

export default function PunchListsPieChart({ punchLists, punchListItems }: Props) {
  const data = useMemo(() => {
    const label = "Total";
    const notStartedTotal = punchListItems.filter((x) => x.Status === Status.NotStarted).length;

    const completedTotal = punchListItems.filter((x) => x.Status === Status.Completed).length;

    return {
      labels: ["Competed", "Not Started"],
      datasets: [
        {
          data: [completedTotal, notStartedTotal],
          label,
          backgroundColor: ["rgb(63 131 248)", "rgb(75 85 99)"],
        },
      ],
    };
  }, [punchLists, punchListItems]);

  return (
    <Pie
      options={{
        plugins: {
          legend: { position: "bottom" },
        },
      }}
      data={data}
    />
  );
}
