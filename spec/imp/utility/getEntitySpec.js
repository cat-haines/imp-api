var Imp = require("../../../index.js")

describe("When an entity is requested", function() {
  var imp;
  var id = "123";
  var collection = "collection";
  var cb = function(err, data) {};

  beforeEach(function() {
    imp = new Imp();
    spyOn(imp, "_req");
  });

  describe("With no ID", function() {
    it("the callback should immediatly fire with an error", function(done) {
      var expectedErr = { "errors": [ {"error": "InvalidParam", "message": "id cannot be null"}]}

      imp.getEntity(collection, null, function(err, data) {
        expect(err.errors[0].error).toBe(expectedErr.errors[0].error);
        expect(err.errors[0].message).toBe(expectedErr.errors[0].message);
        expect(imp._req).not.toHaveBeenCalled();
        done();
      })
    });
  });

  describe("With an ID", function() {
    it("should make the request", function() {
      var expectedVerb = "GET";
      var expectedPath = collection + "/" + id;

      imp.getEntity(collection, id, cb);
      expect(imp._req).toHaveBeenCalledWith("GET", expectedPath, null, null, cb);
    });
  });

})
