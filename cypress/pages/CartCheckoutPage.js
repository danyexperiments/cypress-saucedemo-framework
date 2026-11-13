class CartCheckoutPage {
  verifyItemInCart(itemName) {
    cy.getByDataTest('inventory-item-name').should('contain.text', itemName);
  }

  proceedToCheckout() {
    cy.getByDataTest('checkout').click();
  }

  fillShippingInformation({ firstName, lastName, postalCode }) {
    cy.getByDataTest('firstName').type(firstName);
    cy.getByDataTest('lastName').type(lastName);
    cy.getByDataTest('postalCode').type(postalCode);
    cy.getByDataTest('continue').click();
  }

  finishOrder() {
    cy.getByDataTest('finish').click();
  }

  getConfirmationHeader() {
    return cy.getByDataTest('complete-header');
  }
}

export default new CartCheckoutPage();
