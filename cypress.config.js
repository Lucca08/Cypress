import { defineConfig } from 'cypress';

export default defineConfig({
  screenshotsFolder: 'cypressscreenshots',
  video: false,
  screenshotOnRunFailure: true,
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: true, 
    json: true,
  },
  e2e: {
    setupNodeEvents(on, config) {
      on('after:screenshot', (details) => {
        console.log('Screenshot taken:', details);
      });
    },
    baseUrl: 'https://erickwendel.github.io/vanilla-js-web-app-example/',
  },
  env: {
    failOnStatusCode: false,
  },
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 60000,
  screenshotOnRunSuccess: true,
});
