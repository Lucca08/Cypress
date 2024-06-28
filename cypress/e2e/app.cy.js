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
    
    const newImage = {
      title: this.elements.titleInput().invoke('val'),
      url: this.elements.imageUrlInput().invoke('val')
    };

    newImage.title.then(title => {
      newImage.url.then(url => {
        let images = JSON.parse(localStorage.getItem('images')) || [];
        images.push({ title, url });
        localStorage.setItem('images', JSON.stringify(images));
      });
    });
  }

  getImages() {
    return this.elements.imageList().find('article');
  }
}

const registerForm = new RegisterForm();

describe('Image Registration', () => {
  describe('Submitting an image with invalid inputs', () => {
    const input = {
      title: ' ',
      url: ''
    }

    const colors = {
      errors: 'rgb(220, 53, 69)',
      success: ''
    }

    it('Given I am on the image registration page', () => {
      cy.visit('/')
    })

    it(`When I enter "${input.title}" in the title field`, () => {
      registerForm.typeTitle(input.title);
    })

    it(`Then I enter "${input.url}" in the URL field`, () => {
      registerForm.typeUrl(input.url);
    })

    it(`Then I click the submit button`, () => {
      registerForm.clickSubmit();
    })

    it(`Then I should see "Please type a title for the image" message above the title field`, () => {
      registerForm.elements.titleFeedback().should('contain.text', 'Please type a title for the image');
    })

    it(`And I should see "Please type a valid URL" message above the imageUrl field`, () => {
      registerForm.elements.urlFeedback().should('contain.text', 'Please type a valid URL');
    })

    it(`And I should see an exclamation icon in the title and URL fields`, () => {
      registerForm.elements.titleInput().should(([element]) => {
        const styles = window.getComputedStyle(element);
        const border = styles.getPropertyValue('border-right-color');
        assert.equal(border, colors.errors);
      })
    })
  })

  describe('Submitting an image with valid inputs using enter key', () => {
    const input = {
      title: 'Alien',
      url: 'https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg'
    };

    it('Given I am on the image registration page', () => {
      cy.visit('/');
    });

    it(`When I enter "${input.title}" in the title field`, () => {
      registerForm.typeTitle(input.title);
    });

    it(`Then I enter "${input.url}" in the URL field`, () => {
      registerForm.typeUrl(input.url);
    });

    it(`Then I click the submit button`, () => {
      registerForm.clickSubmit();
    });

    it(`Then I should see a check icon in the title field`, () => {
      registerForm.elements.titleFeedback().should(([element]) => {
        const styles = window.getComputedStyle(element);
        const border = styles.getPropertyValue('border-right-color');
        assert.equal(border, 'rgb(220, 53, 69)');
      });
    });

    it(`Then I should see a check icon in the imageUrl field`, () => {
      registerForm.elements.urlFeedback().should(([element]) => {
        const styles = window.getComputedStyle(element);
        const border = styles.getPropertyValue('border-right-color');
        assert.equal(border, 'rgb(220, 53, 69)');
      });
    });

    it(`Then I should see more than 4 images in the list`, () => {
      registerForm.getImages().should('be.visible').and('have.length', 4);
    });

    it(`And the new item should be stored in the localStorage`, () => {
      cy.window().then((window) => {
        const storedImages = JSON.parse(window.localStorage.getItem('images'));
        expect(storedImages).to.exist;
        expect(storedImages).to.have.lengthOf.equal(4);
      });
    });
  });  
})
