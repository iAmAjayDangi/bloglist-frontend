describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    
    const user = {
      name: 'Test User',
      username: 'testUser',
      password: 'test1234'
    }

    cy.request('POST', 'http://localhost:3003/api/users/', user)

    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testUser')
      cy.get('#password').type('test1234')
      cy.get('#login-button').click()
      cy.contains('successfully logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testUser')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.contains('wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('testUser')
      cy.get('#password').type('test1234')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Test Title')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('testurl.com')
      cy.contains('create').click()
      cy.contains('Test Title added')
    })

    it('A blog can be liked', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Test Title')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('testurl.com')
      cy.contains('create').click()
      cy.contains('like').click()
      cy.contains('view').click()
      cy.contains('1')
    })

    it('A blog can be removed', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Test Title')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('testurl.com')
      cy.contains('create').click()
      cy.contains('view').click()
      cy.contains('remove').click()
    })

  })


  it('creator see remove button', function() {
    cy.get('#username').type('testUser')
    cy.get('#password').type('test1234')
    cy.get('#login-button').click()
    cy.contains('new blog').click()
    cy.get('#title').type('Test Title')
    cy.get('#author').type('Test Author')
    cy.get('#url').type('testurl.com')
    cy.contains('create').click()
    cy.contains('view').click()
    cy.contains('remove')
  })


  it.only('more likes', function() {
    cy.get('#username').type('testUser')
    cy.get('#password').type('test1234')
    cy.get('#login-button').click()
    cy.contains('new blog').click()
    cy.get('#title').type('Test Title1')
    cy.get('#author').type('Test Author1')
    cy.get('#url').type('testurl1.com')
    cy.contains('create').click()
    cy.contains('new blog').click()
    cy.get('#title').type('Test Title')
    cy.get('#author').type('Test Author')
    cy.get('#url').type('testurl.com')
    cy.contains('create').click()
    cy.contains('Test Title1').contains('like').click()
    cy.get('.blog').eq(0).should('contain', 'Test Title1')
    cy.get('.blog').eq(1).should('contain', 'Test Title')
  })

})