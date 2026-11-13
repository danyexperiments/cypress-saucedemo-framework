// Custom selector helper targeting resilient data-test attributes
Cypress.Commands.add('getByDataTest', (selector, ...args) => {
  return cy.get(`[data-test="${selector}"]`, ...args);
});

// Cached authentication command using cy.session()
Cypress.Commands.add('loginWithSession', (username, password) => {
  cy.session(
    [username, password],
    () => {
      cy.visit('/');
      cy.getByDataTest('username').type(username);
      cy.getByDataTest('password').type(password, { log: false });
      cy.getByDataTest('login-button').click();
      cy.url().should('include', '/inventory.html');
    },
    {
      validate() {
        cy.getCookie('session-username').should('have.property', 'value', username);
      },
    }
  );
});
