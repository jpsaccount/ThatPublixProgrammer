/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

//@ts-ignore
Cypress.Commands.add("clearIndexedDB", async () => {
  const databases = await window.indexedDB.databases();

  await Promise.all(
    databases.map(
      ({ name }) =>
        new Promise((resolve, reject) => {
          const request = window.indexedDB.deleteDatabase(name);

          request.addEventListener("success", resolve);
          // Note: we need to also listen to the "blocked" event
          // (and resolve the promise) due to https://stackoverflow.com/a/35141818
          request.addEventListener("blocked", resolve);
          request.addEventListener("error", reject);
        }),
    ),
  );
});
//@ts-ignore
Cypress.Commands.add("login", (type) => {
  //@ts-ignore
  cy.clearIndexedDB();
  //@ts-ignore
  cy.session(type, () => {
    cy.visit("/auth/login");
    // @ts-ignore
    const username = type === "admin" ? "automate@polstudios.com" : "automate-user@polstudios.com";
    const password = "Tester1";
    cy.get("[data-testid=email]").type(username);
    cy.get("[data-testid=password]").type(password);
    cy.get("[data-testid=loginButton]").click();
    cy.url().should("contain", "/auth/active-organization");
    cy.contains("div", "End-to-End Testing").click();
  });
});

//@ts-ignore
Cypress.Commands.add("loggedout", () => {
  //@ts-ignore
  cy.clearIndexedDB();

  cy.session("loggedout", () => {});
  cy.reload();
});
