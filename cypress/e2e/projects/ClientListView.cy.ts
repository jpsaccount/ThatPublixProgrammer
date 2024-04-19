import { getTestTitle } from "cypress/testUtils";

describe("Client List Page", () => {
  beforeEach(() => {
    //@ts-ignore
    cy.login("admin");
  });
  it("Adds a client", () => {
    cy.visit("clients");

    const testTitle = getTestTitle();
    const displayName = "DisplayName" + testTitle;
    cy.get("[data-testid=create-button]").click();
    cy.get("[data-testid=Company-Name-Input]").clear();
    cy.get("[data-testid=Company-Name-Input]").type(testTitle);
    cy.get("[data-testid=Display-Name-Input]").clear();
    cy.get("[data-testid=Display-Name-Input]").type(displayName);
    cy.get("[data-testid=multiFormNextButton]").click();
    cy.get("[data-testid=multiFormNextButton]").should("have.text", "Finish").click();
    cy.url().should("contain", "clients");
    cy.contains(testTitle).should("exist");
    cy.visit("clients");

    cy.contains(displayName).should("exist");
    cy.contains(displayName).click();
    cy.get("[data-testid=moreOptionsIcon]").click();
    cy.contains("Delete").click();
    cy.get("[data-testid=confirmAlert]").click();
  });
});
