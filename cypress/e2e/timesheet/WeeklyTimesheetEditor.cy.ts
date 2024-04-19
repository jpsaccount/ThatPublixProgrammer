import { delay } from "@/sdk/utils/asyncUtils";

describe("Weekly timesheet page", () => {
  beforeEach(() => {
    //@ts-ignore
    cy.login("admin");
    cy.visit("/timesheet");
  });

  describe("should load timesheet when params change", () => {
    beforeEach(() => {
      cy.get("[data-testid=weekSelectedDropdown]").get('[value="This Week"]').should("exist");
      cy.get("[data-testid=weekSelectedDropdown]").click();
      cy.contains("li", "2/4/2024 - 2/10/2024").scrollIntoView().click();

      cy.get("[data-testid=project-dropdown]").eq(0).find("input").type("Apple Inc: P225");
      cy.get("li[data-testid=project-dropdown-option-0]").click();

      cy.get("[data-testid=workingphase-dropdown]").eq(0).find("input").type("Execution");
      cy.get("li[data-testid=workingphase-dropdown-option-0]").click();

      cy.get("[data-testid=role-dropdown]").eq(0).find("input").type("Manager");
      cy.get("li[data-testid=role-dropdown-option-0]").click();

      cy.get("[data-testid=task-dropdown]").eq(0).find("input").type("Review");
      cy.get("li[data-testid=task-dropdown-option-0]").click();
      cy.get("[data-testid=subtask-dropdown]").eq(0).find("input").type("Employee");
      cy.get("li[data-testid=subtask-dropdown-option-0]").click();

      cy.get("[data-testid=description-input]").eq(0).find("input").clear().type("DO NOT DELETE");

      cy.get('[data-testid="hours-input-1"]').eq(0).type("1.5").blur();
      cy.get('[data-testid="hours-input-2"]').eq(0).type("8").blur();
      cy.get('[data-testid="hours-input-4"]').eq(0).type("3.5").blur();
      cy.get("[data-testid=savedIcon]").should("be.visible");
      cy.get("[data-testid=deleteButton]").eq(0).click();
      cy.get("[data-testid=savedIcon]").should("be.visible");

      cy.get("[data-testid=project-dropdown]").eq(0).find("input").type("Apple Inc: P225");
      cy.get("li[data-testid=project-dropdown-option-0]").click();

      cy.get("[data-testid=workingphase-dropdown]").eq(0).find("input").type("Execution");
      cy.get("li[data-testid=workingphase-dropdown-option-0]").click();

      cy.get("[data-testid=role-dropdown]").eq(0).find("input").type("Manager");
      cy.get("li[data-testid=role-dropdown-option-0]").click();

      cy.get("[data-testid=task-dropdown]").eq(0).find("input").type("Review");
      cy.get("li[data-testid=task-dropdown-option-0]").click();
      cy.get("[data-testid=subtask-dropdown]").eq(0).find("input").type("Project Status");
      cy.get("li[data-testid=subtask-dropdown-option-0]").click();

      cy.get("[data-testid=description-input]").eq(0).find("input").clear().type("DO NOT DELETE");

      cy.get('[data-testid="hours-input-1"]').eq(0).type("6.5").blur();
      cy.get('[data-testid="hours-input-3"]').eq(0).type("3.25").blur();
      cy.get('[data-testid="hours-input-5"]').eq(0).type("5.75").blur();
      cy.get("[data-testid=savedIcon]").should("be.visible");
      cy.get("[data-testid=deleteButton]").eq(0).click();
      cy.get("[data-testid=savedIcon]").should("be.visible");

      cy.get("[data-testid=project-dropdown]").eq(0).find("input").type("Apple Inc: P225");
      cy.get("li[data-testid=project-dropdown-option-0]").click();

      cy.get("[data-testid=workingphase-dropdown]").eq(0).find("input").type("Execution");
      cy.get("li[data-testid=workingphase-dropdown-option-0]").click();

      cy.get("[data-testid=role-dropdown]").eq(0).find("input").type("Manager");
      cy.get("li[data-testid=role-dropdown-option-0]").click();

      cy.get("[data-testid=task-dropdown]").eq(0).find("input").type("Review");
      cy.get("li[data-testid=task-dropdown-option-0]").click();
      cy.get("[data-testid=subtask-dropdown]").eq(0).find("input").type("Employee");
      cy.get("li[data-testid=subtask-dropdown-option-0]").click();

      cy.get("[data-testid=description-input]").eq(0).find("input").clear().type("DO NOT DELETE");

      cy.get('[data-testid="hours-input-1"]').eq(0).type("4.75").blur();
      cy.get('[data-testid="hours-input-3"]').eq(0).type("4.5").blur();
      cy.get('[data-testid="hours-input-5"]').eq(0).type("2.25").blur();
      cy.get("[data-testid=savedIcon]").should("be.visible");
      cy.get("[data-testid=deleteButton]").eq(0).click();
      cy.get("[data-testid=savedIcon]").should("be.visible");
      cy.visit("/timesheet");
    });
    afterEach(() => {
      cy.get("[data-testid=project-dropdown]").eq(0).find("input").should("have.value", "Apple Inc: P225");
      cy.get("[data-testid=workingphase-dropdown]").eq(0).find("input").should("have.value", "Execution");
      cy.get("[data-testid=role-dropdown]").eq(0).find("input").should("have.value", "Manager");
      cy.get("[data-testid=task-dropdown]").eq(0).find("input").should("have.value", "Meetings");
      cy.get("[data-testid=subtask-dropdown]").eq(0).find("input").should("have.value", "Weekly Meeting");
      cy.get("[data-testid=description-input]").eq(0).find("input").should("have.value", "DO NOT DELETE");
      cy.get('[data-testid="hours-input-1"]').eq(0).should("have.value", "1.5");
      cy.get('[data-testid="hours-input-2"]').eq(0).should("have.value", "8");
      cy.get('[data-testid="hours-input-4"]').eq(0).should("have.value", "3.5");

      cy.get("[data-testid=project-dropdown]").eq(1).find("input").should("have.value", "Apple Inc: P225");
      cy.get("[data-testid=workingphase-dropdown]").eq(1).find("input").should("have.value", "Execution");
      cy.get("[data-testid=role-dropdown]").eq(1).find("input").should("have.value", "Manager");
      cy.get("[data-testid=task-dropdown]").eq(1).find("input").should("have.value", "Review");
      cy.get("[data-testid=subtask-dropdown]").eq(1).find("input").should("have.value", "Project Status");
      cy.get("[data-testid=description-input]").eq(1).find("input").should("have.value", "DO NOT DELETE");
      cy.get('[data-testid="hours-input-1"]').eq(1).should("have.value", "6.5");
      cy.get('[data-testid="hours-input-3"]').eq(1).should("have.value", "3.25");
      cy.get('[data-testid="hours-input-5"]').eq(1).should("have.value", "5.75");

      cy.get("[data-testid=project-dropdown]").eq(2).find("input").should("have.value", "Apple Inc: P225");
      cy.get("[data-testid=workingphase-dropdown]").eq(2).find("input").should("have.value", "Execution");
      cy.get("[data-testid=role-dropdown]").eq(2).find("input").should("have.value", "Manager");
      cy.get("[data-testid=task-dropdown]").eq(2).find("input").should("have.value", "Review");
      cy.get("[data-testid=subtask-dropdown]").eq(2).find("input").should("have.value", "Employee");
      cy.get("[data-testid=description-input]").eq(2).find("input").should("have.value", "DO NOT DELETE");
      cy.get('[data-testid="hours-input-3"]').eq(2).should("have.value", "4.75");
      cy.get('[data-testid="hours-input-4"]').eq(2).should("have.value", "4.5");
      cy.get('[data-testid="hours-input-5"]').eq(2).should("have.value", "2.25");

      cy.get("[data-testid=deleteButton]").eq(0).click();
      cy.get("[data-testid=deleteButton]").eq(0).click();
      cy.get("[data-testid=deleteButton]").eq(0).click();
    });
    it("Loads Weekly timesheet and week changes", () => {
      cy.get("[data-testid=weekSelectedDropdown]").get('[value="This Week"]').should("exist");
      cy.get("[data-testid=weekSelectedDropdown]").click();
      cy.contains("li", "2/4/2024 - 2/10/2024").scrollIntoView().click();
    });

    it("Loads Weekly timesheet and user changes", () => {
      cy.get("[data-testid=userDropdown]").get('[value="Automate Testing"]').should("exist");
      cy.get("[data-testid=userDropdown]").click();
      cy.contains("li", "Automate User").scrollIntoView().click();

      cy.get("[data-testid=weekSelectedDropdown]").click();
      cy.contains("li", "2/4/2024 - 2/10/2024").scrollIntoView().click();
    });
  });
  it("should add time when dropdowns are filled", () => {
    cy.get("[data-testid=project-dropdown]").eq(0).find("input").type("Apple Inc: P225");
    cy.get("li[data-testid=project-dropdown-option-0]").click();

    cy.get("[data-testid=workingphase-dropdown]").eq(0).find("input").type("Execution");
    cy.get("li[data-testid=workingphase-dropdown-option-0]").click();

    cy.get("[data-testid=role-dropdown]").eq(0).find("input").type("Manager");
    cy.get("li[data-testid=role-dropdown-option-0]").click();

    cy.get("[data-testid=task-dropdown]").eq(0).find("input").type("Review");
    cy.get("li[data-testid=task-dropdown-option-0]").click();
    cy.get("[data-testid=subtask-dropdown]").eq(0).find("input").type("Employee");
    cy.get("li[data-testid=subtask-dropdown-option-0]").click();

    cy.get("[data-testid=description-input]").eq(0).find("input").clear().type("DO NOT DELETE");

    cy.get('[data-testid="hours-input-3"]').eq(0).type("4.75");
    cy.get('[data-testid="hours-input-4"]').eq(0).type("4.5");
    cy.get('[data-testid="hours-input-5"]').eq(0).type("2.25").blur();
    cy.contains("Total: 11.5 hrs").should("exist");
    cy.get("[data-testid=savedIcon]").should("be.visible");
    cy.reload();
    cy.contains("Total: 11.5 hrs").should("exist");
    cy.get("[data-testid=deleteButton]").eq(0).click();
  });

  it("should remove time when delete button pressed", () => {
    cy.get("[data-testid=project-dropdown]").eq(0).find("input").type("Apple Inc: P225");
    cy.get("li[data-testid=project-dropdown-option-0]").click();

    cy.get("[data-testid=workingphase-dropdown]").eq(0).find("input").type("Execution");
    cy.get("li[data-testid=workingphase-dropdown-option-0]").click();

    cy.get("[data-testid=role-dropdown]").eq(0).find("input").type("Manager");
    cy.get("li[data-testid=role-dropdown-option-0]").click();

    cy.get("[data-testid=task-dropdown]").eq(0).find("input").type("Review");
    cy.get("li[data-testid=task-dropdown-option-0]").click();
    cy.get("[data-testid=subtask-dropdown]").eq(0).find("input").type("Employee");
    cy.get("li[data-testid=subtask-dropdown-option-0]").click();

    cy.get("[data-testid=description-input]").eq(0).find("input").clear().type("DO NOT DELETE");

    cy.get('[data-testid="hours-input-5"]').eq(0).type("2.25").blur();
    cy.get("[data-testid=savedIcon]").should("be.visible");
    cy.get("[data-testid=deleteButton]").eq(0).click();
    cy.get("[data-testid=savedIcon]").should("be.visible");
    cy.get('[data-testid="hours-input-5"]').eq(0).should("have.value", "");
  });

  it("should certify timesheet and restrict access", async () => {
    cy.should("not.contain", "animate-spinner-linear-spin");
    cy.get("[data-testid=certifyTimesheet]").click();
    cy.get("[data-testid=confirmAlert]").click();
    cy.get("[data-testid=uncertifyTimesheet]").click();
  });
});
