describe('Navigation', () => {
  it('passes', () => {
    cy.visit('/')
  })

  // タイトルが正しいか確認
  it('has the correct title', () => {
    cy.visit('/')
    cy.title().should('equal', "Sho's Labo")
  })
})