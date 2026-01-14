export class bypassValidation {
  byPassCLoudflareTurnstile() {
    cy.intercept('GET', '**/turnstile/v0/api.js*', (req) => {
      req.reply({
        statusCode: 200,
        body: `
          window.turnstile = {
            render: function(container, params) {
              if (params.callback) {
                setTimeout(() => params.callback('mock-turnstile-token'), 100);
              }
              return 'mock-widget-id';
            },
            reset: function() {},
            remove: function() {}
          };
        `,
      });
    });
  }
}
