var Imp = require("../../../index.js")

describe("When you build a URL", function() {
  it("the client use the specified apiBase and version", function() {
    var testBase = "test-api.electricimp.com";
    var testVersion = "test-version";
    var testPath = "test-path";

    var expectedUrl = "https://test-api.electricimp.com/test-version/test-path";

    var imp = new Imp({
      "apiBase": testBase,
      "apiVersion": testVersion
    });

    expect(imp._buildUrl(testPath)).toBe(expectedUrl);
  });
});
