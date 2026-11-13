# Cypress SauceDemo Framework

A JavaScript end-to-end testing framework for [SauceDemo](https://www.saucedemo.com/), built with Cypress 13. It combines reusable page objects, cached login sessions, network interception, and Mochawesome HTML reports.

## What it covers

- **Authentication smoke tests:** successful login, locked-out-user feedback, and blocking direct access to inventory while unauthenticated.
- **Checkout regression tests:** product price sorting, adding an item to the cart, and completing checkout.
- **Resilience test:** completes a checkout while requests to the Backtrace telemetry service are stubbed to return HTTP 500. The test isolates that dependency; the rest of the flow uses the live SauceDemo site.
- **CI:** GitHub Actions runs the Cypress suite in headless Chrome for pushes and pull requests to `main` or `master`, then uploads the HTML report even if the suite fails.

## Project layout

```text
.
├── .github/workflows/cypress-ci.yml   # GitHub Actions test and report workflow
├── cypress/
│   ├── e2e/
│   │   ├── smoke/auth.cy.js           # Authentication and access-control tests
│   │   └── regression/
│   │       └── checkout-and-intercept.cy.js
│   ├── fixtures/users.json            # Public SauceDemo test accounts and checkout data
│   ├── pages/
│   │   ├── LoginPage.js                # Login page actions and error message
│   │   ├── InventoryPage.js            # Product listing, sorting, cart actions
│   │   └── CartCheckoutPage.js         # Cart and checkout actions
│   └── support/
│       ├── commands.js                 # Shared selector and session-login commands
│       └── e2e.js                      # Cypress support and reporter registration
├── cypress.config.js                   # Cypress defaults and Mochawesome setup
├── package.json                        # Dependencies and test scripts
├── README.md                           # Framework overview and usage
└── CONTRIBUTING.md                     # Local development and contribution process
```

## Requirements and setup

- Node.js 20 or newer
- npm
- Chrome is needed only for `cy:run:chrome`; the default headless run uses Cypress's bundled Electron browser.

Install dependencies from the repository root:

```sh
npm install
```

## Running the tests

```sh
npm run cy:open             # Open the Cypress interactive runner
npm run cy:run              # Run all specs headlessly
npm run cy:run:smoke        # Run authentication smoke tests
npm run cy:run:regression   # Run checkout and network-interception tests
npm run cy:run:chrome       # Run all specs headlessly in Chrome
```

The tests use the configured live base URL, `https://www.saucedemo.com`. The user fixture contains SauceDemo's public demonstration credentials and sample checkout information; do not replace these with personal or production credentials.

## Code and test flow

1. Cypress loads `cypress/support/e2e.js` before each spec. It registers `commands.js` and the Mochawesome reporter.
2. Tests read reusable account and checkout values from `cypress/fixtures/users.json`.
3. Page objects in `cypress/pages/` encapsulate UI operations and `data-test` selectors. Tests keep expectations in the spec files.
4. `cy.getByDataTest()` centralizes element lookup. `cy.loginWithSession()` logs in once per username/password pair and validates the cached `session-username` cookie before reuse.
5. The regression specs exercise the real application. The telemetry test uses `cy.intercept()` to simulate a failing third-party telemetry request and checks that checkout still completes.

Keep selectors and UI workflows in the corresponding page object, and keep scenario intent and assertions in the specs. Add deterministic test data to fixtures rather than duplicating it between tests.

## Reports and artifacts

Cypress is configured to use `cypress-mochawesome-reporter`. A run writes HTML report output under `cypress/reports/html/`; reports, screenshots, and videos are ignored by Git. The CI workflow retains the report artifact for 14 days. Cypress is configured to capture screenshots on run failures and not to record videos.

## Continuous integration

`.github/workflows/cypress-ci.yml` runs on pushes and pull requests targeting `main` or `master`. It checks out the code, invokes the Cypress GitHub Action in headless Chrome, and uploads `cypress/reports/html` with `if: always()` so a failed run can still provide diagnostics.

## Known scope and limitations

- These are browser-level tests against the live public SauceDemo site, so site availability and behavior can affect results.
- Cypress retries are enabled for two attempts in run mode and disabled in interactive mode.
- Only the telemetry request is stubbed; authentication, products, cart, and checkout are not mocked.
- The suite does not use a local application server or private credentials.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the suggested change, validation, and review workflow.
