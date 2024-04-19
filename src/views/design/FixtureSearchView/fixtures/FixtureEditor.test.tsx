import { screen } from "@testing-library/react";
import { render } from "@/appMocks";
import { describe, it, expect, beforeEach } from "vitest";
import { FixtureEditor } from "./FixtureEditor";
import { SelectedFixturesProvider } from "@/contexts/SelectedFixturesContext";
import { Fixture } from "@/sdk/entities/design/Fixture";
import userEvent from "@testing-library/user-event";

const mockFixture = new Fixture();
mockFixture.Name = "Test Fixture";
mockFixture.Description = "Test Description";
mockFixture.ManufacturerName = "Jp's Lighting Fixtures";
mockFixture.Url = "www.POL.com";

describe("FixtureEditor", () => {
  beforeEach(() => {
    render(
      <SelectedFixturesProvider initialSelectedItems={[mockFixture]} Items={[mockFixture]}>
        <FixtureEditor />
      </SelectedFixturesProvider>,
    );
  });
  it("has proper search url", () => {
    const searchElement = screen.getByTestId("googleSearch");

    expect(searchElement).toHaveAttribute(
      "href",
      "https://www.google.com/search?q=Jp's Lighting Fixtures Test Fixture",
    );
  });
  it("displays proper fixture properties", () => {
    const heading = screen.getByTestId("fixture-name");
    const description = screen.getByTestId("description");

    expect(heading).toHaveTextContent("Test Fixture - Jp's Lighting Fixtures");
    expect(description).toHaveTextContent("Test Description");
  });
  it("dropdownTrigger shows more options", async () => {
    const user = userEvent.setup();

    const moreOptions = screen.getByLabelText("dropdownTrigger");
    await user.click(moreOptions);

    const dropdownContent = screen.getByLabelText("moreOptions");

    expect(dropdownContent).toBeVisible();
  });
  it("shows text properties", () => {
    const heading = screen.getByTestId("fixture-name");
    const description = screen.getByTestId("description");

    expect(description).toBeVisible();
    expect(heading).toBeVisible();
  });

  describe("When edit button is clicked", () => {
    beforeEach(async () => {
      const user = userEvent.setup();

      const moreOptions = screen.getByLabelText("dropdownTrigger");
      await user.click(moreOptions);

      const editButton = screen.getByTestId("editButton");

      expect(editButton).toHaveTextContent("Edit");

      await user.click(editButton);
    });
    it("shows editable inputs", () => {
      const manufacturerInput = screen.getByLabelText("manufacturerInput");
      const nameInput = screen.getByLabelText("nameInput");
      const descriptionInput = screen.getByLabelText("descriptionInput");
      const urlInput = screen.getByLabelText("urlInput");

      expect(manufacturerInput).toBeVisible();
      expect(nameInput).toBeVisible();
      expect(descriptionInput).toBeVisible();
      expect(urlInput).toBeVisible();
    });
    it("gives inputs proper values", () => {
      const manufacturerInput = screen.getByLabelText("manufacturerInput");
      const nameInput = screen.getByLabelText("nameInput");
      const descriptionInput = screen.getByLabelText("descriptionInput");
      const urlInput = screen.getByLabelText("urlInput");

      expect(manufacturerInput).toHaveValue("Jp's Lighting Fixtures");
      expect(nameInput).toHaveValue("Test Fixture");
      expect(descriptionInput).toHaveValue("Test Description");
      expect(urlInput).toHaveValue("www.POL.com");
    });
  });
});
