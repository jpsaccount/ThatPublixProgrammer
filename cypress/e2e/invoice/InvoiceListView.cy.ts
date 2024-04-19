import { getTestTitle as generateTestTitle } from "cypress/testUtils";

describe("Invoice List View", () => {
  beforeEach(() => {
    // @ts-ignore
    cy.login("admin");
  });

  it("Creates new invoice and delete it", () => {
    const testTitle = generateTestTitle();

    cy.visit("invoices");
    cy.get("[data-testid=addInvoiceButton]").click();
    cy.get("[data-testid=invoice-number-input]").focus().type("12345");
    cy.get("[data-testid=internal-name-input]").focus().type(testTitle);
    cy.get("[data-testid=create-button]").click();

    cy.get("[data-testid=internal-name]").contains(testTitle).should("exist");
    cy.get("[data-testid=invoice-number]").contains("123").should("exist");

    cy.visit("invoices");

    cy.get("[data-testid=searchInput]").invoke("val", testTitle);
    cy.contains("tr", testTitle).click();

    cy.get("[data-testid=more-options-button]").click();
    cy.contains("button", "Delete").click();
    cy.get("[data-testid=delete-button]").click();

    cy.get("[data-testid=searchInput]").invoke("val", testTitle);
    cy.contains("tr", testTitle).should("not.exist");
  });
});
