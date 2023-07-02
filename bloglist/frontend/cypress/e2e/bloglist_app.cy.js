describe("Bloglist app", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    const user = {
      name: "Tester",
      username: "Tester",
      password: "Test",
    };
    const user2 = {
      name: "Tester2",
      username: "Tester2",
      password: "Test",
    };
    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user);
    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user2);
    cy.visit("");
  });

  it("login form is show", function () {
    cy.contains("username");
    cy.contains("password");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("Tester");
      cy.get("#password").type("Test");
      cy.get("#login-button").click();

      cy.contains("Tester logged-in");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("Tester");
      cy.get("#password").type("wrong");
      cy.get("#login-button").click();

      cy.contains("Wrong credentials");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "Tester", password: "Test" });
    });

    it("A blog can be created", function () {
      cy.contains("new blog").click();
      cy.get(".title").type("this is a title");
      cy.get(".author").type("cypress");
      cy.get(".url").type("totallyaurl.com");
      cy.contains("add").click();
      cy.contains("this is a title");
    });

    describe("and a blog exists", function () {
      beforeEach(function () {
        cy.createBlog({
          title: "this is a title",
          author: "cypress",
          url: "totallyaurl.com",
        });
      });

      it("blog can be voted upon", function () {
        cy.contains("view").click();
        cy.contains("like").click();
        cy.contains("likes 1");
      });

      it("blog can be removed", function () {
        cy.contains("view").click();
        cy.contains("remove").click();
        cy.contains("this is a title").should("not.exist");
      });

      it("blog cant be removed by another user", function () {
        cy.contains("logout").click();
        cy.get("#username").type("Tester2");
        cy.get("#password").type("Test");
        cy.get("#login-button").click();
        cy.contains("view").click();
        cy.contains("remove").should("not.exist");
      });

      it("blog with most likes is first", function () {
        cy.createBlog({
          title: "second blog",
          author: "cypress",
          url: "stillaurl.com",
        });
        cy.get(".toggle").eq(0).click();
        cy.get(".toggle").eq(0).click();
        cy.get(".likesbtn").eq(1).click();
        cy.get(".blog").eq(0).should("contain", "second blog");
      });
    });
  });
});
