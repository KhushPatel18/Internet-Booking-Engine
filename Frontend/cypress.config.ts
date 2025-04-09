import { defineConfig } from "cypress";
import  Task from '@cypress/code-coverage/task'
export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      Task(on, config)
      // include any other plugin code...

      // It's IMPORTANT to return the config object
      // with any changed environment variables
      return config
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
