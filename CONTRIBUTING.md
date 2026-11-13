# Contributing

## Development workflow

1. Create a short-lived branch from `main` (or the repository's configured default branch).
2. Make a focused change. Keep test scenarios in `cypress/e2e/`, reusable page interactions in `cypress/pages/`, shared commands in `cypress/support/`, and sample values in `cypress/fixtures/`.
3. Run the smallest relevant suite while iterating, then run `npm run cy:run` before opening a pull request.
4. Review the generated Cypress report and any failure screenshots locally. Do not commit generated reports, screenshots, videos, local environment files, or credentials.
5. Open a pull request with a concise summary, the behavior covered, and the test command/results. CI runs the full suite in Chrome and publishes the report artifact.

## Test conventions

- Use the existing `data-test` selector helper and page objects rather than repeating raw selectors and UI workflows in specs.
- Prefer assertions on observable application behavior.
- Keep scenarios independent and use the provided fixture for the public SauceDemo demo account and checkout data.
- Stub only external behavior that is specifically under test; the current checkout scenarios intentionally exercise the live SauceDemo application.
- Keep new artifacts and sensitive values out of the repository. The test fixture is for the public demo site only.

## Commit guidance

Use focused commits with imperative subjects, for example:

```text
test: cover locked-out login behavior
test: verify checkout survives telemetry failures
docs: describe local test workflow
```
