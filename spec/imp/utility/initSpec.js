var Imp = require("../../../index.js");

describe("When you initialize a client", function() {
  describe("and you don't specify any settings", function() {
    it("the client should use the default settings", function() {
      var expectedApiKey = null;
      var expectedApiBase = "api.electricimp.com";
      var expectedApiVersion = "api_v4";

      var imp = new Imp();

      expect(imp.apiKey).toBe(expectedApiKey);
      expect(imp.apiBase).toBe(expectedApiBase);
      expect(imp.apiVersion).toBe(expectedApiVersion);
    });
  });

  describe("and you don't pass a table parameter for settings", function() {
    it("the client should ignore the settings parameter", function() {
      var expectedApiKey = null;
      var expectedApiBase = "api.electricimp.com";
      var expectedApiVersion = "api_v4";

      var imp = new Imp("garbage");

      expect(imp.apiKey).toBe(expectedApiKey);
      expect(imp.apiBase).toBe(expectedApiBase);
      expect(imp.apiVersion).toBe(expectedApiVersion);
    })
  })

  describe("and overload the default settings", function() {
    it("the client should use the specified settings", function() {
      var expectedApiKey = "myApiKey";
      var expectedApiBase = "myUri";
      var expectedApiVersion = "myVersion";

      var imp = new Imp({
        "apiKey": expectedApiKey,
        "apiBase": expectedApiBase,
        "apiVersion": expectedApiVersion
      });

      expect(imp.apiKey).toBe(expectedApiKey);
      expect(imp.apiBase).toBe(expectedApiBase);
      expect(imp.apiVersion).toBe(expectedApiVersion);
    });
  });
});
