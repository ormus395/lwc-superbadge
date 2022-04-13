const { jestConfig } = require("@salesforce/sfdx-lwc-jest/config");
module.exports = {
  ...jestConfig,
  moduleNameMapper: {
    "^lightning/messageService$":
      "<rootDir>/force-app/tests/jest-mocks/lightning/messageService"
  }
};
