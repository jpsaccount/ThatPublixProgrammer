import { getTestTitle as generateTestTitle } from "cypress/testUtils";

describe("Create expense", () => {
  beforeEach(() => {
    // @ts-ignore
    cy.login("admin");
  });
  it("Loads expense report", () => {
    const testTitle = generateTestTitle();

    cy.visit("expense/905fb7a3-db32-409d-8a4e-92c44a8107ea/8b4529f3-c4db-4a64-a284-1bd11abc8dac");
    cy.get("[data-testid=addExpenseButton]").click();
    cy.get("[data-testid=merchantNameInput]").type(testTitle);
    cy.get("[data-testid=descriptionInput]").type("Test Description");
    cy.get("[data-testid=amountInput]").type("55");
    cy.contains("button", "Save").click();

    cy.get("[data-testid=searchInput]").invoke("val", testTitle);

    cy.contains("tr", testTitle).click();
    cy.get("[data-testid=more-expense-options]").click();
    cy.get("[data-testid=more-expense-options-delete]").click();
    cy.contains("td", testTitle).should("not.exist");
  });
});
