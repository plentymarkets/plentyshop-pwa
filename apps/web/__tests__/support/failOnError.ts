Cypress.on("window:before:load", win => {
  cy.stub(win.console, "error").callsFake(msg => {
    throw new Error(msg)
  })
});

Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('zoid')) {
    return false;
  }

  console.error('Uncaught exception', err);
  throw err;
});