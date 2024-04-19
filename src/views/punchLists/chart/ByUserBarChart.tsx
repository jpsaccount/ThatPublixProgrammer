import React, { useMemo } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { PunchList } from "@/sdk/entities/punchList/PunchList";
import { PunchListItem } from "@/sdk/entities/punchList/PunchListItem";
import { Status } from "@/sdk/enums/Status";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { User } from "@/sdk/entities/core/User";
import { PunchListItemAssignment } from "@/sdk/childEntities/PunchListItemAssignment";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  punchLists: PunchList[];
  punchListItems: PunchListItem[];
}

export default function ByUserBarChart({ punchLists, punchListItems }: Props) {
  const users = useDbQuery(User);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  const availableUsers = useMemo(() => {
    const userss = [];

    punchListItems.forEach((item) => {
      item.Assignments.forEach((assignment) => {
        if (!userss.includes(assignment.AssignedToUserId)) {
          userss.push(assignment.AssignedToUserId);
        }
      });
    });
    return userss;
  }, [punchListItems]);

  const checkIsAssignedTo = (assignments: PunchListItemAssignment[], userId: string) => {
    const contains = assignments.some((assignment) => assignment.AssignedToUserId === userId);
    return contains;
  };
  const data = useMemo(() => {
    if (!users.data) {
      return null;
    }
    console.log("Available", availableUsers);
    const completedData = availableUsers.map((userId) => {
      return punchListItems.reduce((count, item) => {
        if (item.Status === Status.Completed && checkIsAssignedTo(item.Assignments, userId)) {
          return count + 1;
        }
        return count;
      }, 0);
    });

    const notStartedData = availableUsers.map((userId) => {
      return punchListItems.reduce((count, item) => {
        if (item.Status === Status.NotStarted && checkIsAssignedTo(item.Assignments, userId)) {
          return count + 1;
        }
        return count;
      }, 0);
    });

    const labels = availableUsers.map((x) => getFullName(users.data.find((user) => user.id === x).Person));

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
  }, [punchListItems, punchLists, availableUsers, users]);
  if (data === null) return null;
  return <Bar options={options} data={data} />;
}
