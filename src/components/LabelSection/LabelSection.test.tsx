import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { LabelSection } from "./LabelSection";

describe("LabelSection", () => {
  it("renders text in label", () => {
    render(
      <LabelSection label="Test">
        <div>Child Div</div>
      </LabelSection>,
    );
    expect(screen.getByTestId("label")).toHaveTextContent("Test");
  });

  it("renders label on right side", () => {
    render(
      <LabelSection position="Right" label="Test">
        <div>Child Div</div>
      </LabelSection>,
    );
    expect(screen.getByTestId("label").parentElement).toHaveClass("grid-flow-row");
  });
  it("renders child content", () => {
    render(
      <LabelSection label="Test">
        <div>Child Div</div>
      </LabelSection>,
    );

    expect(screen.getByText("Child Div")).toBeInTheDocument();
  });
  it("renders label on right side", () => {
    render(
      <LabelSection position="Right" label="Test">
        <div data-testid="childDiv">Child Div</div>
      </LabelSection>,
    );
    const label = screen.getByTestId("label");
    const div = screen.getByTestId("childDiv");

    expect(screen.getByTestId("labelSection")).toHaveClass("grid-flow-row");

    expect(label).toBeInTheDocument();
    expect(div).toBeInTheDocument();

    const labelPosition = Array.from(label.parentElement.children).indexOf(label);
    const childPosition = Array.from(label.parentElement.children).indexOf(div);
    expect(labelPosition).toBeGreaterThan(childPosition);
  });
  it("renders label on left side", () => {
    render(
      <LabelSection position="Left" label="Test">
        <div data-testid="childDiv">Child Div</div>
      </LabelSection>,
    );
    const label = screen.getByTestId("label");
    const div = screen.getByTestId("childDiv");

    expect(screen.getByTestId("labelSection")).toHaveClass("grid-flow-row");

    expect(label).toBeInTheDocument();
    expect(div).toBeInTheDocument();

    const labelPosition = Array.from(label.parentElement.children).indexOf(label);
    const childPosition = Array.from(label.parentElement.children).indexOf(div);
    expect(childPosition).toBeGreaterThan(labelPosition);
  });
  it("renders label on top side", () => {
    render(
      <LabelSection position="Left" label="Test">
        <div data-testid="childDiv">Child Div</div>
      </LabelSection>,
    );
    const label = screen.getByTestId("label");
    const div = screen.getByTestId("childDiv");

    expect(label).toBeInTheDocument();
    expect(div).toBeInTheDocument();

    const labelPosition = Array.from(label.parentElement.children).indexOf(label);
    const childPosition = Array.from(label.parentElement.children).indexOf(div);

    expect(childPosition).toBeGreaterThan(labelPosition);
  });
  it("renders label on top side", () => {
    render(
      <LabelSection position="Left" label="Test">
        <div data-testid="childDiv">Child Div</div>
      </LabelSection>,
    );
    const label = screen.getByTestId("label");
    const div = screen.getByTestId("childDiv");

    expect(label).toBeInTheDocument();
    expect(div).toBeInTheDocument();

    const labelPosition = Array.from(label.parentElement.children).indexOf(label);
    const childPosition = Array.from(label.parentElement.children).indexOf(div);

    expect(childPosition).toBeGreaterThan(labelPosition);
  });
  it("renders with className on labelSection", () => {
    render(
      <LabelSection className="w-48" label="Test">
        <div>Child Div</div>
      </LabelSection>,
    );
    const labelSection = screen.getByTestId("labelSection");

    expect(labelSection).toHaveClass("w-48");
  });
});
