var Imp = require("../../../index.js")

describe("When you request a collection", function() {
  var imp;
  var cb = function(err, data) {};
  var collection = "collection";

  beforeEach(function() {
    imp = new Imp();
    spyOn(imp, "_req");
  });

  describe("with no parameters", function() {
    it("should make the request", function() {

      imp.getCollection(collection, null, {}, cb);
      expect(imp._req).toHaveBeenCalledWith("GET", collection, null, {}, cb);
    });
  });

  describe("with invalid parameters", function() {
    it("should make the request", function(done) {

      var expectedError = { "errors": [{ "error": "InvalidParam", "message": "Invalid parameter: a" }] };

      imp.getCollection(collection, { "a": true }, { "b": true }, function(err, data) {
        expect(err).toEqual(expectedError);
        expect(imp._req).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe("with valid parameters", function() {
    it("should make the request with the options", function() {
      var options = { "device_id" : "1", "mac_address": "1", "model_id": "1", "name": "1" };
      var validOptions = { "device_id" : true, "mac_address": true, "model_id": true, "name": true };

      imp.getCollection(collection, options, validOptions, cb);
      expect(imp._req).toHaveBeenCalledWith("GET", collection, null, options, cb);
    });
  });

});
