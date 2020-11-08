///<reference types="cypress"/>

describe('Sign Up Tests', () => {

    let credentials

    before(() => {
        cy.fixture('credentials').then(values => {
            credentials = values
        })
    });

    beforeEach(() => {
        cy.visit('/')
        cy.contains('button', 'Login').as('loginBtn')
        cy.contains('Signup here!').click()
        cy.get('[type="email"]').as('email')
        cy.get('[type="password"]').as('password')
        cy.get('[type="text"]').as('name')
        cy.contains('button', 'Signup').as('signBtn')
    });

    it('should display input name on Sign up screen', () => {
        cy.contains('.form-group', 'Name').should('be.visible')
    });

    it('should require a valid email', () => {
        let cred = credentials[0]

        cy.enterSignValues(cred.email, cred.password, cred.name)
        cy.clickSignBtn()
        cy.assertMessage('Email')
    });

    it('should require a password of more than 6 characters', () => {
        let cred = credentials[1]

        cy.enterSignValues(cred.email, cred.password, cred.name)
        cy.clickSignBtn()
        cy.assertMessage('Password')
    });

    it('should sign up successfully', () => {
        const loginMessage = 'You have successfully signed up for lite farm. Go ahead and login!'
        let cred = credentials[2]

        cy.enterSignValues(cred.email, cred.password, cred.name)
        cy.clickSignBtn()
        cy.get('.alert-success').should('be.visible').then(alert => {
            expect(alert.text().trim()).to.equal(loginMessage);
        })
        cy.contains('.form-group', 'Name').should('not.be.visible')
    });

    it('should login with the created user', () => {
        let cred = credentials[2]

        cy.login(cred.email, cred.password)
        cy.contains('button', 'Log Out').should('be.visible')
        cy.get('.white-text').then(user => {
            expect(user.text()).to.equal('Signed in as: ' + cred.name)
        })
    });

});
