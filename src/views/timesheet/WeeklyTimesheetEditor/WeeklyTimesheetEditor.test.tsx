import { render, useAdminUser } from "@/appMocks";
import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { setDropdownOption, waitForLoadingAsync } from "./../../../testing/utilties/customHelpers";
import WeeklyTimesheetEditor from "./WeeklyTimesheetEditor";

describe("Weekly timesheet main page", () => {
  it("Should add a timeblock when add line is clicked", async () => {
    const user = userEvent.setup();
    await useAdminUser();

    const result = render(<WeeklyTimesheetEditor></WeeklyTimesheetEditor>);
    const button = result.getByTestId("add-button");
    expect(button).toBeDisabled();
    await waitForLoadingAsync(result);

    await waitFor(
      () => {
        expect(button.hasAttribute("disabled") === false).toBe(true);
      },
      { timeout: 10000, interval: 500 },
    );

    await user.click(button);
    await user.click(button);
    await user.click(button);

    const projectDropdownResults = await result.findAllByTestId("project-dropdown");
    expect(projectDropdownResults).toHaveLength(3);
  });

  it("Selecting a project should set the client", async () => {
    const user = userEvent.setup();
    await useAdminUser();

    const result = render(<WeeklyTimesheetEditor></WeeklyTimesheetEditor>);

    const button = result.getByTestId("add-button");

    await waitForLoadingAsync(result);

    await waitFor(
      () => {
        expect(button.hasAttribute("disabled") === false).toBe(true);
      },
      { timeout: 10000, interval: 500 },
    );

    await user.click(button);

    const { dropdown: selectedOption } = await result.getDropdownByTestId("client-dropdown");

    expect(selectedOption).toBeInTheDocument();
    const { dropdown: projectDropdown } = await result.getDropdownByTestId("project-dropdown");

    setDropdownOption(projectDropdown, 0);

    const { value } = await result.getDropdownByTestId("project-dropdown");
    const { value: clientValue } = await result.getDropdownByTestId("client-dropdown");

    result.debug();

    expect(value).not.toBe("");
    expect(value).not.toBe(null);
    expect(clientValue).not.toBe("");
    expect(clientValue).not.toBe(null);
  });
});
