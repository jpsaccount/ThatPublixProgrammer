import { fireEvent, getByText, render, useAdminUser, waitFor as waitForAsync } from "@/appMocks";
import { describe, expect, it } from "vitest";
import ProjectView from "./ProjectView";
import { act } from "react-dom/test-utils";
import { waitForLoadingAsync } from "@/testing/utilties/customHelpers";
import userEvent from "@testing-library/user-event";

const DOWN_ARROW = { keyCode: 40 };
const ENTER = { keyCode: 13 };

describe(
  "Project view",
  async () => {
    it("Should not create a project foreal during testing", async () => {
      const user = userEvent.setup();
      useAdminUser();

      const dom = render(<ProjectView></ProjectView>);

      await waitForLoadingAsync(dom);
      await waitForAsync(
        async () => {
          const element = await dom.findByTestId("create-button");
          expect(element).toBeInTheDocument();
        },
        { timeout: 10000, interval: 500 },
      );

      const button = await dom.findByTestId("create-button");

      user.click(button);

      const result = await dom.findByTestId("client-dropdown");
      act(() => {
        result.focus();
        fireEvent.keyDown(result, DOWN_ARROW);
        fireEvent.keyDown(result, ENTER);
      });
      await waitForAsync(() => expect(dom.getByText("Point of Light")).toBeInTheDocument());

      act(() => {
        dom.getByText("Point of Light").click();
      });

      act(() => {
        dom.getByText("Next").click();
      });
      act(() => {
        dom.getByText("Next").click();
      });
      act(() => {
        dom.getByText("Finish").click();
      });
    });
  },
  { timeout: 20000 },
);
