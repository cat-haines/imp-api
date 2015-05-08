var Imp = require("../../index.js")

describe("When getDevices is requested", function() {
  it("it should make a call to getCollection", function() {
    var validOptions = {"device_id": true, "mac_address": true, "model_id": true, "name": true };
    var options = { "device_id": "test" };
    var collection = "devices"
    var cb = function(err, data) { };

    imp = new Imp();
    spyOn(imp, "getCollection");

    imp.getDevices(options, cb);
    expect(imp.getCollection).toHaveBeenCalledWith(collection, options, validOptions, cb);
  });
});

describe("When getDevice is called", function() {
  it("it should make a call to getEntity", function() {
    var collection = "devices";
    var id = "123";
    var cb = function(err, data) { };

    imp = new Imp();
    spyOn(imp, "getEntity");

    imp.getDevice(id, cb);
    expect(imp.getEntity).toHaveBeenCalledWith(collection, id, cb);
  });
});
