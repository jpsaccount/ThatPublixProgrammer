import { toUsdString } from "@/sdk/utils/moneyUtils";
import { getTestTitle as generateTestTitle } from "cypress/testUtils";
import { te } from "date-fns/locale";
beforeEach(() => {
  // @ts-ignore
  cy.login("admin");
  cy.visit("invoices/d6c60512-db31-4a8c-af1f-397fd99319ce");
});
describe("Invoice Detail View", () => {
  it("Change input values", () => {
    const testTitle = generateTestTitle();

    const internalNameInput = cy.get("[data-testid=internal-name-input]");
    internalNameInput.clear();
    internalNameInput.focus();
    internalNameInput.type("test", { force: true });
    internalNameInput.should("contain.value", "test");
    cy.get("[data-testid=internal-name").contains("test").should("exist");
    internalNameInput.clear({ force: true });
    internalNameInput.type("DO NOT DELETE OR MODIFY", { force: true });
    cy.get("[data-testid=internal-name").contains("DO NOT DELETE OR MODIFY").should("exist");

    const invoiceNumberInput = cy.get("[data-testid=invoice-number-input]");

    invoiceNumberInput.clear();
    invoiceNumberInput.focus();
    invoiceNumberInput.type("123", { force: true });
    invoiceNumberInput.should("contain.value", "123");
    invoiceNumberInput.clear({ force: true });
    invoiceNumberInput.type("12345", { force: true });
    invoiceNumberInput.should("contain.value", "12345");
    cy.get("[data-testid=invoice-number").contains("12345").should("exist");

    const contractInput = cy.get("[data-testid=contract-input]");
    contractInput.clear();
    contractInput.focus();
    contractInput.type("123", { force: true });
    contractInput.should("contain.value", "123");
    contractInput.clear({ force: true });
    contractInput.type("Test Contract", { force: true });
    contractInput.should("contain.value", "Test Contract");

    const changeOrderInput = cy.get("[data-testid=change-order-input]");
    changeOrderInput.clear();
    changeOrderInput.focus();
    changeOrderInput.type("123", { force: true });
    changeOrderInput.should("contain.value", "123");
    changeOrderInput.clear({ force: true });
    changeOrderInput.type("Test Change Order", { force: true });
    changeOrderInput.should("contain.value", "Test Change Order");

    const projectNameInput = cy.get("[data-testid=project-name-input]");
    projectNameInput.clear();
    projectNameInput.focus();
    projectNameInput.type("testing", { force: true });
    projectNameInput.should("contain.value", "testing");
    projectNameInput.clear({ force: true });
    projectNameInput.type("Test Project", { force: true });
    projectNameInput.should("contain.value", "Test Project");

    // const projectDropdown = cy.get("[data-testid=project-dropdown]");
    // projectDropdown.click();
    // projectDropdown.type("Project M");
    // cy.get("li").click().wait(1000);
    // projectDropdown.contains("Project M");
    // projectDropdown.click();
    // projectDropdown.type("DO NOT DELETE");
    // projectDropdown.contains("DO NOT DELETE");

    const memoInputs = cy.get("[data-testid=memo-input]");
    memoInputs.clear();
    memoInputs.focus();
    memoInputs.type("testing", { force: true });
    memoInputs.should("contain.value", "testing");
    memoInputs.clear({ force: true });
    memoInputs.type("Test Memo", { force: true });
    memoInputs.should("contain.value", "Test Memo");
  });

  it("Opens and closes the details section", () => {
    const detailsButton = cy.get("[data-testid=show-hide-details-button]");

    cy.get("[id=details-card").should("exist");
    detailsButton.click();

    cy.get("[id=details-card").should("not.exist");
    detailsButton.click();
    cy.get("[id=details-card").should("exist");
  });

  it("Create and deletes charge table", () => {
    cy.get('[data-testid="new-charge-table-button"]').click();
    cy.get('[data-testid="header-input-inside-modal"]').type("Test Header");
    cy.get('[data-testid="create-button"]').click();

    cy.get('[data-testid="accordion-trigger-Test Header"]').should("exist");
    cy.get('[data-testid="more-vertical-Test Header"').click();
    cy.get("li > .flex").click();
  });

  it("Shows and hides Charge Table content", () => {
    cy.get('[data-testid="accordion-trigger-DO NOT DELETE OR MODIFY"] > .h-4').click();
    cy.get('[data-testid="udpate-button-DO NOT DELETE OR MODIFY"]').should("exist");
    cy.get('[data-testid="accordion-trigger-DO NOT DELETE OR MODIFY"] > .h-4').click({ force: true });
    cy.get('[data-testid="udpate-button-DO NOT DELETE OR MODIFY"]').should("not.exist");
  });

  it("Updates billable service item when update is saved", () => {
    const updatedData = {
      workingPhase: "Lumpsum",
      description: "Test Description",
      quantity: "1",
      rate: "50",
    };

    const originalData = {
      workingPhase: "Lumpsum",
      description: "DO NOT DELETE OR MODIFY",
      quantity: "1",
      rate: "50",
    };

    cy.get('[data-testid="accordion-trigger-DO NOT DELETE OR MODIFY"] > .h-4').click();

    cy.get(`[data-testid="udpate-button-${originalData.description}"]`).click();

    cy.get('[data-testid="working-phase-dropdown"]').click().type("Lumpsum");
    cy.get(`li[role="option"]`).click();
    cy.get('[data-testid="description-input"]').type("{selectAll}" + updatedData.description);
    cy.get('[data-testid="quantity-input"]').type("{selectAll}" + updatedData.quantity);
    cy.get('[data-testid="rate-input"]').type("{selectAll}" + updatedData.rate);
    cy.get('[data-testid="save-button"]').click();

    // cy.get('[data-testid="working-phase-Test Description"]').contains(updatedData.workingPhase);
    cy.get(`[data-testid="description-${updatedData.description}"]`).should("include.text", updatedData.description);
    cy.get(`[data-testid="quantity-${updatedData.description}"]`).should("include.text", updatedData.quantity);
    cy.get(`[data-testid="rate-${updatedData.description}"]`).should("include.text", updatedData.rate);

    cy.get(`[data-testid="udpate-button-${updatedData.description}"]`).click();
    cy.get('[data-testid="description-input"]').type("{selectAll}" + originalData.description);
    cy.get('[data-testid="quantity-input"]').type("{selectAll}" + originalData.quantity);
    cy.get('[data-testid="rate-input"]').type("{selectAll}" + originalData.rate);
    cy.get('[data-testid="save-button"]').click();

    // cy.get('[data-testid="working-phase-Test Description"]').contains(originalData.workingPhase);
    cy.get(`[data-testid="description-${originalData.description}"]`).should("include.text", originalData.description);
    cy.get(`[data-testid="quantity-${originalData.description}"]`).should("include.text", originalData.quantity);
    cy.get(`[data-testid="rate-${originalData.description}"]`).should("include.text", originalData.rate);
  });

  it("Creates billable service", () => {
    const newBillableService = {
      workingPhase: "Lumpsum",
      description: "ffsajiofwijfwaionksafsa",
      quantity: "502020220",
      rate: "6290629062906290",
    };

    cy.get('[data-testid="accordion-trigger-DO NOT DELETE OR MODIFY"] > .h-4').click();
    cy.get('[data-testid="new-billable-service-button"]').click();

    cy.get('[data-testid="working-phase-dropdown"]').click().type(newBillableService.workingPhase);
    cy.get(`li[role="option"]`).click();
    cy.get('[data-testid="description-input"]').type("{selectAll}" + newBillableService.description);
    cy.get('[data-testid="quantity-input"]').type("{selectAll}" + newBillableService.quantity);
    cy.get('[data-testid="rate-input"]').type("{selectAll}" + newBillableService.rate);
    cy.get('[data-testid="save-button"]').click();

    cy.contains(newBillableService.description);
    cy.contains(newBillableService.quantity);
    cy.contains(toUsdString(Number(newBillableService.rate)));
  });

  it("Shows add billable item modal", () => {
    cy.get('[data-testid="accordion-trigger-DO NOT DELETE OR MODIFY"] > .h-4').click();
    cy.get('[data-testid="billable-item-modal-button"]').click();

    cy.get('[data-testid="billable-modal"]').should("exist");
  });

  it("Adds and Deletes a deduction", () => {
    const newDeduction = {
      title: "219428910rksdfjsaklfjaskl",
      description: "Test Description538i9-5281951",
      workingPhase: "Lumpsum",
      amount: "5521952189052180",
    };

    cy.get('[data-testid="add-deduction-button"]').click();

    cy.get('[data-testid="title-input"]').type(newDeduction.title);
    cy.get('[data-testid="description-input"]').type(newDeduction.description);
    cy.get('[data-testid="working-phase-dropdown"]').click().type(newDeduction.workingPhase);
    cy.get(`li[role="option"]`).click();
    cy.get('[data-testid="retainage-input"]').type(newDeduction.amount);
    cy.get('[data-testid="save-button"]').click();

    cy.get(`[data-testid="title-${newDeduction.title}"]`).should("exist");
    cy.get(`[data-testid="description-${newDeduction.title}"]`).should("exist");
    cy.get(`[data-testid="percentage-${newDeduction.title}"]`).should("exist");
    cy.get(`[data-testid="amount-${newDeduction.title}"]`).should("exist");
    cy.get(`[data-testid="delete-${newDeduction.title}"]`).click();

    cy.get(`[data-testid="title-${newDeduction.title}"]`).should("not.exist");
    cy.get(`[data-testid="description-${newDeduction.title}"]`).should("not.exist");
    cy.get(`[data-testid="percentage-${newDeduction.title}"]`).should("not.exist");
    cy.get(`[data-testid="amount-${newDeduction.title}"]`).should("not.exist");
  });
});
