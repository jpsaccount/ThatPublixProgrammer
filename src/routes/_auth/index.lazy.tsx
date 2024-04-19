import { withAccess } from "@/components/AuthRoute";
import PolIcon from "@/components/PolIcon";
import PolHeading from "@/components/polComponents/PolHeading";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Timeline } from "flowbite-react";

export const Route = createLazyFileRoute("/_auth/")({
  component: withAccess(Index, AccessKeys.User),
});
function Index() {
  return (
    <div className="m-2 grid grid-flow-row p-5">
      <PolHeading className="my-2">Timeline</PolHeading>
      <Timeline>
        <Timeline.Item>
          <Timeline.Point icon={() => <PolIcon name="Check" size="1rem" />} />
          <Timeline.Content>
            <Timeline.Time>February 16</Timeline.Time>
            <Timeline.Title>Expense Reports</Timeline.Title>
            <Timeline.Body>Expense reports are fully working.</Timeline.Body>
          </Timeline.Content>
        </Timeline.Item>

        <Timeline.Item>
          <Timeline.Point icon={() => <PolIcon name="Check" size="1rem" />} />
          <Timeline.Content>
            <Timeline.Time>February 16</Timeline.Time>
            <Timeline.Title>Timesheets</Timeline.Title>
            <Timeline.Body>
              Timesheet works, but may experience bugs.
            </Timeline.Body>
          </Timeline.Content>
        </Timeline.Item>

        <Timeline.Item>
          <Timeline.Point
            icon={() => <PolIcon name="Minus" size="1rem" />}
            color="var(--primary-900)"
          />
          <Timeline.Content>
            <Timeline.Time>February 21</Timeline.Time>
            <Timeline.Title>Invoicing (Beta)</Timeline.Title>
            <Timeline.Body>
              Invoicing works, but may experience bugs.
            </Timeline.Body>
          </Timeline.Content>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Point />
          <Timeline.Content>
            <Timeline.Time>March 1st</Timeline.Time>
            <Timeline.Title>
              Client, and Project Management, Dropdown editor (Beta)
            </Timeline.Title>
            <Timeline.Body>
              These areas will be our next priority, giving more flexibility to
              the timesheet.
            </Timeline.Body>
          </Timeline.Content>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Point />
          <Timeline.Content>
            <Timeline.Time>March 6th</Timeline.Time>
            <Timeline.Title>Equipment Page</Timeline.Title>
            <Timeline.Body></Timeline.Body>
          </Timeline.Content>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Point />
          <Timeline.Content>
            <Timeline.Time>March 6th</Timeline.Time>
            <Timeline.Title>Equipment Page</Timeline.Title>
            <Timeline.Body></Timeline.Body>
          </Timeline.Content>
        </Timeline.Item>

        <Timeline.Item>
          <Timeline.Point />
          <Timeline.Content>
            <Timeline.Time>March 6th</Timeline.Time>
            <Timeline.Title>Manufacturer Page</Timeline.Title>
            <Timeline.Body></Timeline.Body>
          </Timeline.Content>
        </Timeline.Item>
      </Timeline>
    </div>
  );
}
