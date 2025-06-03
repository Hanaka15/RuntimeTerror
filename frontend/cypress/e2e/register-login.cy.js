describe('template spec', () => {
  it('passes', () => {
    cy.visit('/');
  });
});


describe('Registration navigation flow', () => {
  it('should navigate to the registration page from the login screen', () => {
    const email = `test${Date.now()}@test.com`
    cy.visit('/login');
    cy.get(`[data-test="login-form"]`).should('exist');
    cy.get(`[data-test="register-link"]`).click();

    cy.url().should('include', '/register');
    cy.get(`[data-test="register-form"]`).should('exist');

    cy.get(`[data-test="register-email"]`).type(email);
    cy.get(`[data-test="register-username"]`).type('Testuser');
    cy.get(`[data-test="register-password"]`).type('Testpassword123!');
    cy.get(`[data-test="register-confirm-password"]`).type('Testpassword123!');
    cy.get(`[data-test="register-button"]`).click();

    cy.url().should('include', '/login');
    cy.get(`[data-test="login-form"]`).should('exist');

    cy.get(`[data-test="login-email"]`).type(email);
    cy.get(`[data-test="login-password"]`).type('Testpassword123!');
    cy.get(`[data-test="login-button"]`).click();

    cy.url().should('include', '/dashboard');
    cy.get('[data-test="dashboard-home"]').should('exist');
  });
});