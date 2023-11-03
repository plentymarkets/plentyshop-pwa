Cypress.on("window:before:load", win => {
  cy.stub(win.console, "error").callsFake(msg => {
    throw new Error(msg)
  })
});