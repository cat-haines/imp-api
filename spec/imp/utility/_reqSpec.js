var Imp = require("../../../index.js")

describe("When _req is called", function() {
  var imp;
  var apiKey = "abc123";
  var cb = function(err, data) {};

  beforeEach(function() {
    imp = new Imp({ "apiKey": apiKey });

    // create a stub for _buildUrl
    imp._buildUrl = function(val) {
      return val;
    };

    spyOn(imp, "_buildUrl").and.callThrough();
    spyOn(imp, "request");
    spyOn(imp, "_processResp");
  });

  describe("with a GET request", function() {
    it("options should be properly built, and form should be set to body", function() {
      var expectedVerb = "GET";
      var expectedUrl = "some-path";
      var expectedHeaders = { "test-key": "test", "test-key1": "test1" };
      var expectedBody = { "foo": "bar "};
      var expectedAuth = "Basic " + new Buffer(apiKey).toString('base64');


      imp._req(expectedVerb, expectedUrl, expectedHeaders, expectedBody, cb);

      // Make sure options was populated properly
      expect(imp._buildUrl).toHaveBeenCalledWith(expectedUrl);
      expect(imp.request.calls.mostRecent().args[0].method).toEqual(expectedVerb);
      expect(imp.request.calls.mostRecent().args[0].json).toEqual(true);
      expect(imp.request.calls.mostRecent().args[0].url).toEqual(expectedUrl);
      expect(imp.request.calls.mostRecent().args[0].form).toEqual(expectedBody);
      expect(imp.request.calls.mostRecent().args[0].headers["User-agent"]).toEqual("imp.js");
      expect(imp.request.calls.mostRecent().args[0].headers["Content-type"]).toEqual("application/json");
      expect(imp.request.calls.mostRecent().args[0].headers["Authorization"]).toEqual(expectedAuth);
      for(var idx in expectedHeaders) {
        expect(imp.request.calls.mostRecent().args[0].headers[idx]).toEqual(expectedHeaders[idx]);
      }
    });
  });

  describe("with a non-GET request", function() {
    it("options should be properly built, and body should be set to body", function() {
      var expectedVerb = "POST";
      var expectedUrl = "some-path";
      var expectedHeaders = { "test-key": "test", "test-key1": "test1" };
      var expectedBody = { "foo": "bar "};
      var expectedAuth = "Basic " + new Buffer(apiKey).toString('base64');

      imp._req(expectedVerb, expectedUrl, expectedHeaders, expectedBody, cb);

      // Make sure options was populated properly
      expect(imp._buildUrl).toHaveBeenCalledWith(expectedUrl);
      expect(imp.request.calls.mostRecent().args[0].method).toEqual(expectedVerb);
      expect(imp.request.calls.mostRecent().args[0].json).toEqual(true);
      expect(imp.request.calls.mostRecent().args[0].url).toEqual(expectedUrl);
      expect(imp.request.calls.mostRecent().args[0].body).toEqual(expectedBody);
      expect(imp.request.calls.mostRecent().args[0].headers["User-agent"]).toEqual("imp.js");
      expect(imp.request.calls.mostRecent().args[0].headers["Content-type"]).toEqual("application/json");
      expect(imp.request.calls.mostRecent().args[0].headers["Authorization"]).toEqual(expectedAuth);
      for(var idx in expectedHeaders) {
        expect(imp.request.calls.mostRecent().args[0].headers[idx]).toEqual(expectedHeaders[idx]);
      }
    });
  });
});
