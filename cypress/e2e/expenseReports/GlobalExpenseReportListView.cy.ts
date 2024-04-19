import { getTestTitle } from "cypress/testUtils";

describe("Global Expense Report Page", () => {
  beforeEach(() => {
    //@ts-ignore
    cy.login("admin");
  });

  it("Creates Global Expense Report, adds user, modifies user access, confirms user access, and deletes", () => {
    const expenseReportTitle = getTestTitle();

    cy.visit("expense");
    cy.get("[data-testid=addButton]").click();
    cy.get("[data-testid=titleInput]").focus().type(expenseReportTitle);
    cy.get("[data-testid=projectDropdown]").click().type(`P225`);
    cy.get("li[data-testid=projectDropdown-option-0]").click();
    cy.get("[data-testid=descriptionInput]").focus().type(`Description`);
    cy.get("[data-testid=userDropdown]").click().type("automate@polstudios.com");
    cy.get("li[data-testid=userDropdown-option-0]").click();

    cy.get("[data-testid=saveButton]").click();

    cy.get("[data-testid=searchInput]").invoke("val", expenseReportTitle);
    cy.contains("tr", expenseReportTitle).click();

    cy.contains("td", "Automate Testing").should("exist");

    cy.go("back");

    cy.contains("tr", expenseReportTitle).find("[data-testid=editButton]").click();

    cy.get(`[value="P225"]`).should("exist");
    cy.get("[data-testid=userDropdown]").click().type("automate-user");
    cy.get("li[data-testid=userDropdown-option-0]").click();

    cy.get("[data-testid=saveButton]").click();

    cy.get("[data-testid=searchInput]").invoke("val", expenseReportTitle);
    cy.contains("tr", expenseReportTitle).click();

    cy.contains("td", "Automate User").should("exist");

    cy.go("back");

    cy.contains("tr", expenseReportTitle).find("[data-testid=editButton]").click();

    cy.contains("p", "Automate User").should("exist");

    cy.get("[data-testid=moreOptionsButton]").click();
    cy.contains("button", "Delete").click();
    cy.contains("td", expenseReportTitle).should("not.exist");
  });
});
