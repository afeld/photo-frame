const { jsWithBabel: tsjPreset } = require("ts-jest/presets");

module.exports = {
  ...tsjPreset,
  testPathIgnorePatterns: ["\\.snap$", "node_modules/", "/web/"]
};
