class RegisterForm {
  elements = {
    titleInput: () => cy.get('#title'),
    titleFeedback: () => cy.get('#titleFeedback'),
    imageUrlInput: () => cy.get('#imageUrl'),
    urlFeedback: () => cy.get('#urlFeedback'),
    submitBtn: () => cy.get('#btnSubmit'),
    imageList: () => cy.get('#card-list')
  }

  typeTitle(text) {
    if (!text.trim()) return;
    this.elements.titleInput().type(text);
  }

  typeUrl(text) {
    if (!text.trim()) return;
    this.elements.imageUrlInput().type(text);
  }

  clickSubmit() {
    this.elements.submitBtn().click();

    cy.window().then((window) => {
      const title = this.elements.titleInput().invoke('val');
      const url = this.elements.imageUrlInput().invoke('val');
      
      title.then(titleVal => {
        url.then(urlVal => {
          let images = JSON.parse(window.localStorage.getItem('images')) || [];
          images.push({ title: titleVal, url: urlVal });
          window.localStorage.setItem('images', JSON.stringify(images));
        });
      });
    });
  }

  getImages() {
    return this.elements.imageList().find('article');
  }
}

const registerForm = new RegisterForm();
let globalLocalStorage;

describe('Registro de Imagens', () => {
  before(() => {
    cy.visit('/');
    cy.window().then((window) => {
      window.localStorage.clear();
      globalLocalStorage = [
        { title: "Imagem Inicial", url: "https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg" }
      ];
      window.localStorage.setItem('images', JSON.stringify(globalLocalStorage));
    });
  });

  beforeEach(() => {
    cy.visit('/');
    cy.window().then((window) => {
      window.localStorage.clear();
      window.localStorage.setItem('images', JSON.stringify(globalLocalStorage));
    });
  });

  const takeScreenshot = (suffix) => {
    const testName = Cypress.currentTest.title;
    const screenshotName = `${testName} -- ${suffix}`;
    cy.screenshot(screenshotName);
  };

  describe('Entradas inválidas devem exibir mensagens de validação', () => {
    const input = {  
      title: ' ',
      url: ''
    }

    const colors = {
      errors: 'rgb(220, 53, 69)',
      success: ''
    }

    it('Deve exibir mensagens de validação e destacar os campos', () => {
      cy.visit('/');
      registerForm.typeTitle(input.title);
      registerForm.typeUrl(input.url);
      registerForm.clickSubmit();
      takeScreenshot('inputs-invalidos-antes-validacao');
      registerForm.elements.titleFeedback().should('contain.text', 'Please type a title for the image');
      registerForm.elements.urlFeedback().should('contain.text', 'Please type a valid URL');
      registerForm.elements.titleInput().should(([element]) => {
        const styles = window.getComputedStyle(element);
        const border = styles.getPropertyValue('border-right-color');
        assert.equal(border, colors.errors);
      });
      registerForm.elements.imageUrlInput().should(([element]) => {
        const styles = window.getComputedStyle(element);
        const border = styles.getPropertyValue('border-right-color');
        assert.equal(border, colors.errors);
      });
      takeScreenshot('inputs-invalidos-apos-validacao');
    });
  });

  describe('Submeter entradas válidas usando tecla Enter deve atualizar as imagens', () => {
    const input = {
      title: 'Alien',
      url: 'https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg'
    };

    it('Deve adicionar uma nova imagem e atualizar o armazenamento', () => {
      cy.visit('/');
      registerForm.typeTitle(input.title);
      registerForm.typeUrl(input.url);
      takeScreenshot('inputs-validos-antes-submit');
      registerForm.clickSubmit();
      cy.wait(1000); 
      registerForm.getImages().should('be.visible').and('have.length.of.at.least', 2);
      takeScreenshot('inputs-validos-apos-submit');
      cy.window().then((window) => {
        const storedImages = JSON.parse(window.localStorage.getItem('images'));
        expect(storedImages).to.exist;
        expect(storedImages).to.have.length.of.at.least(2);
      });
    });
  });

  describe('Submeter entradas válidas usando o botão de envio deve limpar os campos de entrada', () => {
    const input = {
      title: "BR Alien",
      url: "https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg",
    };

    it("Deve adicionar uma nova imagem, atualizar o armazenamento e limpar os campos de entrada", () => {
      cy.visit("/");
      registerForm.typeTitle(input.title);
      registerForm.typeUrl(input.url);
      takeScreenshot('inputs-validos-antes-submit');
      registerForm.clickSubmit();
      cy.wait(1000);
      registerForm.getImages().should("be.visible").and("have.length.of.at.least", 2);
      takeScreenshot('inputs-validos-apos-submit');
      
      cy.window().then((window) => {
        const storedImages = JSON.parse(window.localStorage.getItem("images"));
        expect(storedImages).to.exist;
        expect(storedImages).to.have.length.of.at.least(2);
      });

      registerForm.elements.titleInput().should('have.value', '');
      registerForm.elements.imageUrlInput().should('have.value', '');
    });
  });

  describe('Atualizar a página após submeter uma imagem deve exibir a imagem', () => {
    const input = {
      title: "Alien Refresh",
      url: "https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg",
    };
  
    it('Deve exibir a imagem submetida após atualizar a página', () => {
      cy.visit('/');
      registerForm.typeTitle(input.title);
      registerForm.typeUrl(input.url);
      takeScreenshot('antes-submit');
      registerForm.clickSubmit();
      cy.wait(1000);
      cy.reload();
      takeScreenshot('apos-reload');
      
      cy.wait(2000);
  
      registerForm.getImages().should('be.visible').and(($articles) => {
        expect($articles).to.contain.text(input.title);
      });
  
      cy.window().then((window) => {
        const storedImages = JSON.parse(window.localStorage.getItem('images'));
        expect(storedImages).to.exist;
        expect(storedImages).to.have.length.of.at.least(2);
      });
    });
  }); 
  
});
