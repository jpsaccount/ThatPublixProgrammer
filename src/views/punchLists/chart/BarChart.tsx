import React, { useMemo } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { PunchList } from "@/sdk/entities/punchList/PunchList";
import { PunchListItem } from "@/sdk/entities/punchList/PunchListItem";
import { Status } from "@/sdk/enums/Status";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  punchLists: PunchList[];
  punchListItems: PunchListItem[];
}
export default function BarChart({ punchLists, punchListItems }: Props) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };
  const data = useMemo(() => {
    const completedData = punchLists.map((list) => {
      return punchListItems.filter((item) => item.Status === Status.Completed && item.PunchListId === list.id).length;
    });

    const notStartedData = punchLists.map((list) => {
      return punchListItems.filter((item) => item.Status === Status.NotStarted && item.PunchListId === list.id).length;
    });

    const labels = punchLists.map((list) => list.Title);

    return {
      labels,
      datasets: [
        {
          label: "Completed",
          data: completedData,
          backgroundColor: "rgb(63 131 248)",
        },
        {
          label: "Not Started",
          data: notStartedData,
          backgroundColor: "rgb(75 85 99)",
        },
      ],
    };
  }, [punchListItems, punchLists]);
  return <Bar options={options} data={data} />;
}
