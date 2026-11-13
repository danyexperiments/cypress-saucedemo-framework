import InventoryPage from '../../pages/InventoryPage';
import CartCheckoutPage from '../../pages/CartCheckoutPage';

describe('E2E Checkout & Network Interception Suite @regression', () => {
  beforeEach(function () {
    cy.fixture('users').then((users) => {
      this.users = users;
      cy.loginWithSession(users.standardUser.username, users.standardUser.password);
    });
  });

  it('sorts products by price low-to-high accurately', () => {
    InventoryPage.visit();
    InventoryPage.sortBy('lohi');

    InventoryPage.getItemPrices().then((prices) => {
      const sortedPrices = [...prices].sort((a, b) => a - b);
      expect(prices).to.deep.equal(sortedPrices);
    });
  });

  it('completes full add-to-cart and checkout workflow', function () {
    InventoryPage.visit();
    InventoryPage.addItemToCartBySlug('sauce-labs-backpack');
    InventoryPage.getCartBadge().should('have.text', '1');

    InventoryPage.openCart();
    CartCheckoutPage.verifyItemInCart('Sauce Labs Backpack');
    CartCheckoutPage.proceedToCheckout();

    CartCheckoutPage.fillShippingInformation(this.users.checkoutCustomer);
    CartCheckoutPage.finishOrder();

    CartCheckoutPage.getConfirmationHeader()
      .should('be.visible')
      .and('have.text', 'Thank you for your order!');
  });

  it('remains functional when background telemetry API returns 500 Internal Server Error', function () {
    // Stub external telemetry/error-logging requests to simulate downstream outage
    cy.intercept('POST', '**/*backtrace.io/**', {
      statusCode: 500,
      body: { error: 'Simulated Telemetry Service Outage' },
    }).as('telemetryOutage');

    InventoryPage.visit();
    InventoryPage.addItemToCartBySlug('sauce-labs-bike-light');
    InventoryPage.getCartBadge().should('have.text', '1');

    InventoryPage.openCart();
    CartCheckoutPage.verifyItemInCart('Sauce Labs Bike Light');
    CartCheckoutPage.proceedToCheckout();
    CartCheckoutPage.fillShippingInformation(this.users.checkoutCustomer);
    CartCheckoutPage.finishOrder();

    CartCheckoutPage.getConfirmationHeader().should('have.text', 'Thank you for your order!');
  });
});
