import LoginPage from '../../pages/LoginPage';
import InventoryPage from '../../pages/InventoryPage';

describe('Authentication & Access Control @smoke', () => {
  beforeEach(function () {
    cy.fixture('users').as('users');
  });

  it('logs in successfully with standard_user credentials', function () {
    const { username, password } = this.users.standardUser;

    LoginPage.visit();
    LoginPage.login(username, password);

    cy.url().should('include', '/inventory.html');
    InventoryPage.getHeaderTitle().should('have.text', 'Products');
  });

  it('displays locked-out error banner for locked_out_user', function () {
    const { username, password } = this.users.lockedOutUser;

    LoginPage.visit();
    LoginPage.login(username, password);

    LoginPage.getErrorMessage()
      .should('be.visible')
      .and('contain.text', 'Sorry, this user has been locked out.');
  });

  it('blocks unauthenticated direct navigation to inventory page', () => {
    InventoryPage.visit();

    cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
    LoginPage.getErrorMessage()
      .should('be.visible')
      .and('contain.text', "You can only access '/inventory.html' when you are logged in.");
  });
});
