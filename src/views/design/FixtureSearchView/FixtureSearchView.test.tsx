import { render } from "@/appMocks";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import FixtureSearchView from "./FixtureSearchView";
import userEvent from "@testing-library/user-event";

describe("FixtureSearchView", () => {
  beforeEach(() => {
    render(<FixtureSearchView></FixtureSearchView>);
  });
  it("handles searching", async () => {
    const user = userEvent.setup();

    const searchInput = screen.getByTestId("searchInput");

    await user.type(searchInput, "example");

    expect(searchInput).toHaveValue("example");
  });
  it("create button shows create fixture component", async () => {
    const user = userEvent.setup();

    const createButton = screen.getByTestId("createButton");

    await user.click(createButton);

    expect(screen.getByTestId("createModal")).toBeVisible();
  });
});
