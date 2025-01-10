import { MyAccountPageObject } from '../../support/pageObjects/MyAccountPageObject';
import { paths } from '../../../utils/paths';

const guardedRoutes = [
    paths.accountPersonalData,
    paths.accountBillingDetails,
    paths.accountShippingDetails,
    paths.accountMyOrders,
    paths.accountMyWishlist,
    paths.accountReturns,
    paths.accountNewReturn + '/1/accessKey'
];

describe('Auth Guard', () => {
    beforeEach(() => {
        cy.clearCookie('pwa-session-id');
    });
    
    it('should redirect from accountPersonalData to login page if user is not authorized', () => {
        cy.visit(paths.accountPersonalData);
        cy.url().should('include', paths.authLogin);
    });

    it('should redirect from accountBillingDetails to login page if user is not authorized', () => {
        cy.visit(paths.accountBillingDetails);
        cy.url().should('include', paths.authLogin);
    });

    it('should redirect from accountShippingDetails to login page if user is not authorized', () => {
        cy.visit(paths.accountShippingDetails);
        cy.url().should('include', paths.authLogin);
    });

    it('should redirect from accountMyOrders to login page if user is not authorized', () => {
        cy.visit(paths.accountMyOrders);
        cy.url().should('include', paths.authLogin);
    });

    it('should redirect from accountMyWishlist to login page if user is not authorized', () => {
        cy.visit(paths.accountMyWishlist);
        cy.url().should('include', paths.authLogin);
    });

    it('should redirect from accountReturns to login page if user is not authorized', () => {
        cy.visit(paths.accountReturns);
        cy.url().should('include', paths.authLogin);
    });

    it('should redirect from accountNewReturn to login page if user is not authorized', () => {
        cy.visit(paths.accountNewReturn + '/1/accessKey');
        cy.url().should('include', paths.authLogin);
    });

    it('should allow access to authorized users', () => {
        const myAccount = new MyAccountPageObject();

        cy.intercept('/plentysystems/doLogin').as('doLogin');
        cy.visitAndHydrate(paths.authLogin);
        myAccount.successLogin();

        cy.wait('@doLogin');
        
        guardedRoutes.forEach((route) => {
            cy.visitAndHydrate(route);
            cy.url().should('include', route);
        });
    });

    it('should redirect back to protected page after successful login', () => {
        const myAccount = new MyAccountPageObject();

        cy.visit(paths.accountPersonalData);
        cy.url().should('include', `${paths.authLogin}?redirect=${paths.accountPersonalData}`);

        cy.intercept('/plentysystems/doLogin').as('doLogin');
        myAccount.successLogin();

        cy.wait('@doLogin');
        cy.url().should('include', paths.accountPersonalData);
    });

});