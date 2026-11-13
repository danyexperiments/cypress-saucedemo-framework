class InventoryPage {
  visit() {
    cy.visit('/inventory.html', { failOnStatusCode: false });
  }

  getHeaderTitle() {
    return cy.getByDataTest('title');
  }

  sortBy(optionValue) {
    cy.getByDataTest('product-sort-container').select(optionValue);
  }

  getItemPrices() {
    return cy.getByDataTest('inventory-item-price').then(($prices) => {
      return Cypress._.map($prices, (el) => parseFloat(el.innerText.replace('$', '')));
    });
  }

  addItemToCartBySlug(itemSlug) {
    cy.getByDataTest(`add-to-cart-${itemSlug}`).click();
  }

  getCartBadge() {
    return cy.getByDataTest('shopping-cart-badge');
  }

  openCart() {
    cy.getByDataTest('shopping-cart-link').click();
  }
}

export default new InventoryPage();
