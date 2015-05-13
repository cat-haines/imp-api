var Imp = require("../lib/imp");

describe("When getDevices is requested", function() {
  it("it should make a call to collectionRequest", function() {
    var validOptions = {"device_id": true, "mac_address": true, "model_id": true, "name": true };
    var options = { "device_id": "test" };
    var collection = "devices"
    var cb = function(err, data) { };

    imp = new Imp();
    spyOn(imp, "collectionRequest");

    imp.getDevices(options, cb);
    expect(imp.collectionRequest).toHaveBeenCalledWith("GET", collection, options, validOptions, cb);
  });
});

describe("When getDevice is called", function() {
  it("it should make a call to entityRequest", function() {
    var verb = "GET";
    var collection = "devices";
    var id = "123";
    var cb = function(err, data) { };

    imp = new Imp();
    spyOn(imp, "entityRequest");

    imp.getDevice(id, cb);
    expect(imp.entityRequest).toHaveBeenCalledWith(verb, collection, id, null, null, cb);
  });
});

describe("When renameDevice is called", function() {
  it("it should make a call to entityRequest", function() {
    var verb = "PUT";
    var collection = "devices";
    var id = "123";
    var cb = function(err, data) { };
    var validOptions = { "name": true }
    var options = { "name" : "test" }

    imp = new Imp();
    spyOn(imp, "entityRequest");

    imp.renameDevice(id, options.name, cb);
    expect(imp.entityRequest).toHaveBeenCalledWith(verb, collection, id, options, validOptions, cb);
  });
});

describe("When deleteDevice is called", function() {
  it("it should make a call to entityRequest", function() {
    var verb = "DELETE";
    var collection = "devices";
    var id = "123";
    var cb = function(err, data) { };

    imp = new Imp();
    spyOn(imp, "entityRequest");

    imp.deleteDevice(id, cb);
    expect(imp.entityRequest).toHaveBeenCalledWith(verb, collection, id, null, null, cb);
  });
});

describe("When assignDevice is called", function() {
  it("it should make a call to entityRequest", function() {
    var verb = "PUT";
    var collection = "devices";
    var device_id = "123";
    var model_id = "abc"
    var body = { "model_id": model_id };
    var validOptions = { "model_id": true };
    var cb = function(err, data) { };

    imp = new Imp();
    spyOn(imp, "entityRequest");

    imp.assignDevice(device_id, model_id, cb);
    expect(imp.entityRequest).toHaveBeenCalledWith(verb, collection, device_id, body, validOptions, cb);
  });
});


describe("When getModels is requested", function() {
  it("it should make a call to collectionRequest", function() {
    var validOptions = {"name": true };
    var options = { "name": "test" };
    var collection = "models"
    var cb = function(err, data) { };

    imp = new Imp();
    spyOn(imp, "collectionRequest");

    imp.getModels(options, cb);
    expect(imp.collectionRequest).toHaveBeenCalledWith("GET", collection, options, validOptions, cb);
  });
});

describe("When getModel is called", function() {
  it("it should make a call to entityRequest", function() {
    var verb = "GET";
    var collection = "models";
    var id = "123";
    var cb = function(err, data) { };

    imp = new Imp();
    spyOn(imp, "entityRequest");

    imp.getModel(id, cb);
    expect(imp.entityRequest).toHaveBeenCalledWith(verb, collection, id, null, null, cb);
  });
});

describe("When createModel is called", function() {
  it("it should make a call to entityRequest", function() {
    var verb = "POST";
    var collection = "models";
    var id = "123";
    var cb = function(err, data) { };
    var validOptions = { "name": true }
    var options = { "name" : "test" }

    imp = new Imp();
    spyOn(imp, "entityRequest");

    imp.createModel(id, options.name, cb);
    expect(imp.entityRequest).toHaveBeenCalledWith(verb, collection, id, options, validOptions, cb);
  });
});


describe("When renameModel is called", function() {
  it("it should make a call to entityRequest", function() {
    var verb = "PUT";
    var collection = "models";
    var id = "123";
    var cb = function(err, data) { };
    var validOptions = { "name": true }
    var options = { "name" : "test" }

    imp = new Imp();
    spyOn(imp, "entityRequest");

    imp.renameModel(id, options.name, cb);
    expect(imp.entityRequest).toHaveBeenCalledWith(verb, collection, id, options, validOptions, cb);
  });
});

describe("When deleteModel is called", function() {
  it("it should make a call to entityRequest", function() {
    var verb = "DELETE";
    var collection = "models";
    var id = "123";
    var cb = function(err, data) { };

    imp = new Imp();
    spyOn(imp, "entityRequest");

    imp.deleteModel(id, cb);
    expect(imp.entityRequest).toHaveBeenCalledWith(verb, collection, id, null, null, cb);
  });
});

