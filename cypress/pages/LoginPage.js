class LoginPage {
  visit() {
    cy.visit('/');
  }

  login(username, password) {
    if (username) {
      cy.getByDataTest('username').clear().type(username);
    }
    if (password) {
      cy.getByDataTest('password').clear().type(password, { log: false });
    }
    cy.getByDataTest('login-button').click();
  }

  getErrorMessage() {
    return cy.getByDataTest('error');
  }
}

export default new LoginPage();
