var Request = require("request");

function Imp(settings) {
  this.request = Request;

  if (typeof settings != "object") settings = {};

  this.apiKey = null;
  this.apiBase = "api.electricimp.com";
  this.apiVersion = "api_v4";

  if(settings && "apiKey" in settings) this.apiKey = settings.apiKey;
  if(settings && "apiBase" in settings) this.apiBase = settings.apiBase;
  if(settings && "apiVersion" in settings) this.apiVersion = settings.apiVersion;
};

Imp.prototype._buildUrl = function(path) {
  return "https://" + this.apiBase + "/" + this.apiVersion + "/" + path;
}

Imp.prototype._processResp = function(err, resp, body, cb) {
  // if there was an error with the request
  if(err) {
    cb(err, null);
    return;
  }

  // if we didn't get a 2XX status code
  if (resp.statusCode < 200 || resp.statusCode >= 300) {

    if(body == null || typeof body != "object" || !("errors" in body)) {
      body = { "errors": [{
        "error": resp.statusMessage,
        "message": resp.statusMessage
      }]};
    }

    cb(body, null);
    return;
  }

  cb(null, body);
}

Imp.prototype._req = function(verb, path, headers, body, cb) {
  var options = {
    "method": verb.toUpperCase(),
    "json": true,
    "url": this._buildUrl(path),
    "headers": {
      "User-agent": "imp.js",
      "Content-type": "application/json",
      "Authorization": "Basic " + new Buffer(this.apiKey || "").toString('base64')
    }
  };

  if(body && options.method == "GET") {
    options.form = body;
  } else if (body) {
    options.body = body
  }

  headers = headers || {};
  for(var idx in headers) {
    options.headers[idx] = headers[idx];
  }

  this.request(options, function(err, resp, body) {
    this._processResp(err, resp, body, cb);
  }.bind(this));
}

Imp.prototype.getCollection = function(collection, options, validOptions, cb) {
  var options = options || {};
  var validOptions = validOptions || {};

  for(var idx in options) {
    if (!(idx in validOptions)) {
      var error = { "errors": [{ "error": "InvalidParam", "message": "Invalid parameter: " + idx }] };
      cb(error, null);
      return;
    }
  }

  this._req("GET", collection, null, options, cb);
}

Imp.prototype.getEntity = function(collection, id, cb) {
  if (!id) {
    var err = { "errors": [ {"error": "InvalidParam", "message": "id cannot be null"}]}
    cb(err, null);
    return;
  }

  this._req("GET", collection + "/" + id.toString(), null, null, cb);
}

/***** This is the good part.. the part we care about *****/
Imp.prototype.getDevices = function(options, cb) {
  var validOptions = {"device_id": true, "mac_address": true, "model_id": true, "name": true };
  this.getCollection("devices", options, validOptions, cb);
}

Imp.prototype.getDevice = function(id, cb) {
  this.getEntity("devices", id, cb);
}

Imp.prototype.getModels = function(options, cb) {
  var validOptions = { "name": true }
  this.getCollection("models", options, validOptions, cb);
}

Imp.prototype.getModel = function(id, cb) {
  this.getEntity("models", id, cb);
}

module.exports = Imp;
