
Cypress.Commands.add('clickSignBtn', () =>{
    cy.get('@signBtn').click()
});

Cypress.Commands.add('enterSignValues', (email, password, name) => {
    cy.get('@email').type(email)
    cy.get('@password').type(password)
    cy.get('@name').type(name)
});

Cypress.Commands.add('assertMessage', (field) => {
    const errorsText = {
        "Email": "Please type in a valid email",
        "Password": "Please type a password with more than 6 characters.",
        "Name": "Please type in your name"
    }
    cy.get('.invalid-feedback').then( message => {
        expect(message.text()).to.be.equal(errorsText[field]);
    }) 
});

Cypress.Commands.add('login',(email, password) => {
    cy.get('.no-border').click()
    // cy.get('@loginBtn').click()
    cy.get('@email').type(email)
    cy.get('@password').type(password)
    cy.get('@loginBtn').click()
});





