import { getTestTitle } from "cypress/testUtils";

describe("Client List Page", () => {
  beforeEach(() => {
    //@ts-ignore
    cy.login("admin");
  });
  it("Adds a client", () => {
    cy.visit("clients");

    const testTitle = getTestTitle();
    const displayName = "This is an automated displayName";
    cy.get("[data-testid=create-button]").click();
    cy.get(":nth-child(1) > .stackGrid > .input-bg-colors").clear();
    cy.get(":nth-child(1) > .stackGrid > .input-bg-colors").type(testTitle);
    cy.get(".chakra-fade > :nth-child(1) > :nth-child(2) > .stackGrid > .input-bg-colors").clear();
    cy.get(".chakra-fade > :nth-child(1) > :nth-child(2) > .stackGrid > .input-bg-colors").type(displayName);
    cy.get("[data-testid=multiFormNextButton]").click();
    cy.get("[data-testid=multiFormNextButton]").should("have.text", "Finish").click();
    cy.contains(testTitle).should("exist");
    cy.visit("clients");

    cy.contains(displayName).should("exist");
    cy.contains(displayName).click();
    cy.get("[data-testid=moreOptionsIcon]").click();
    cy.contains("Delete").click();
    cy.get("[data-testid=confirmAlert]").click();
  });
});
