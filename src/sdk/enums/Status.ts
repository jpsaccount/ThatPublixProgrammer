export enum Status {
  NotStarted,
  InProgress,
  Completed,
}

export function getStatusString(status: Status) {
  switch (status) {
    case Status.NotStarted:
      return "Not Started";
    case Status.InProgress:
      return "In Progress";
    case Status.Completed:
      return "Completed";
  }
}
