const { jestConfig } = require("@salesforce/sfdx-lwc-jest/config");
module.exports = {
  ...jestConfig,
  moduleNameMapper: {
    "^lightning/messageService$":
      "<rootDir>/force-app/tests/jest-mocks/lightning/messageService",
    "^lightning/platformShowToastEvent$":
      "<rootDir>/force-app/tests/jest-mocks/lightning/platformShowToastEvent.js",
    "^lightning/navigation$":
      "<rootDir>/force-app/tests/jest-mocks/lightning/navigation"
  }
};
