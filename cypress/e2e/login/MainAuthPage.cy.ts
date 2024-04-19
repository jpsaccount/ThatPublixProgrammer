import { delay } from "@/sdk/utils/asyncUtils";

describe("redirection", () => {
  beforeEach(() => {
    //@ts-ignore
    cy.loggedout();
  });
  it("redirects when not logged in and navigating auth restricted page", () => {
    cy.visit("/");
    cy.url().should("contain", "login");

    cy.visit("/timesheet");
    cy.url().should("contain", "login");
  });

  it("does not redirects when not logged in and navigating public page", async () => {
    cy.visit("/auth/register");
    await delay(500);
    cy.url().should("not.contain", "login");
  });

  it("redirects after login", () => {
    cy.visit("/timesheet");

    cy.get("[data-testid=email]").type("automate@polstudios.com");
    cy.get("[data-testid=password]").type("Tester1");
    cy.get("[data-testid=loginButton]").click();
    cy.url().should("contain", "/active-organization");
    cy.contains("div", "End-to-End Testing").click();

    cy.url().should("contain", "timesheet");
  });

  it("redirects to active tenant after login and tries to navigate", () => {
    cy.visit("/timesheet");

    cy.get("[data-testid=email]").type("automate@polstudios.com");
    cy.get("[data-testid=password]").type("Tester1");
    cy.get("[data-testid=loginButton]").click();
    cy.url().should("contain", "/active-organization");
    cy.visit("/timesheet");
    cy.url().should("contain", "/active-organization?redirect=%2Ftimesheet");
    cy.contains("div", "End-to-End Testing").click();

    cy.url().should("contain", "timesheet");
  });
});

describe("Main Auth Page", () => {
  beforeEach(() => {
    cy.visit("/auth/login");
  });

  it("logins in successfully", () => {
    cy.get("[data-testid=email]").type("automate@polstudios.com");
    cy.get("[data-testid=password]").type("Tester1");
    cy.get("[data-testid=loginButton]").click();
    cy.url().should("contain", "/active-organization");
    cy.contains("div", "End-to-End Testing").click();

    cy.url().should("equal", "http://localhost:5173/");
  });

  it("logins in successfully with enter key", () => {
    cy.get("[data-testid=email]").type("automate@polstudios.com");
    cy.get("[data-testid=password]").type("Tester1");
    cy.get("[data-testid=password]").type("{enter}");
    cy.url().should("contain", "/active-organization");
    cy.contains("div", "End-to-End Testing").click();

    cy.url().should("equal", "http://localhost:5173/");
  });

  describe("invalid auth", () => {
    it("gives error message if password is invalid", () => {
      cy.get("[data-testid=email]").type("automate@polstudios.com");
      cy.get("[data-testid=password]").type("WrongPassword");
    });

    it("gives error message if username is invalid", () => {
      cy.get("[data-testid=email]").type("automate@polstudio.com");
      cy.get("[data-testid=password]").type("Tester1");
    });

    afterEach(() => {
      cy.get("[data-testid=loginButton]").click();
      cy.contains("div", "Your email or password was incorrect.");
    });
  });
  it("signup hyperlink takes you to signup", () => {
    cy.contains("a", "Sign up").click();
    cy.url().should("equal", "http://localhost:5173/auth/register");
  });
});
