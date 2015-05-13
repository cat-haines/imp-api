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

Imp.prototype._buildError = function(code, shortMessage, fullMessage) {
  if (fullMessage === undefined) fullMessage = shortMessage;

  return {
    "code": code,
    "message_short": shortMessage,
    "message_full": fullMessage
  };
};

Imp.prototype._buildUrl = function(path) {
  return "https://" + this.apiBase + "/" + this.apiVersion + "/" + path;
};

Imp.prototype._processResp = function(error, resp, body, cb) {
  // if there was an error with the request
  if(error) {
    cb(error, null);
    return;
  }

  // if we didn't get a 2XX status code
  if (resp.statusCode < 200 || resp.statusCode >= 300) {
    var error = this._buildError(resp.statusCode, resp.statusMessage);

    if(body) {
      if (typeof body == "string") {
        error.message_short = body;
        error.message_full = body;
      } else if (typeof body == "object" && "error" in body) {
        error = body.error;
      }
    }

    cb(error, null);
    return;
  }
  cb(null, body);
};

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
    options.body = body;
  }

  headers = headers || {};
  for(var idx in headers) {
    options.headers[idx] = headers[idx];
  }

  this.request(options, function(error, resp, body) {
    this._processResp(error, resp, body, cb);
  }.bind(this));
};

Imp.prototype.collectionRequest = function(verb, collection, options, validOptions, cb) {
  var options = options || {};
  var validOptions = validOptions || {};

  if(options) {
    for(var idx in options) {
      if (!(idx in validOptions)) {
        var error = this._buildError("InvalidParam", "Invalid Parameter: " + idx);
        cb(error, null);
        return;
      }
    }
  }

  this._req(verb, collection, null, options, cb);
};

Imp.prototype.entityRequest = function(verb, collection, id, options, validOptions, cb) {
  if (!id) {
    var error = this._buildError("InvalidParam", "id cannot be null");
    cb(error, null);
    return;
  }

  if (options) {
    for(var idx in options) {
      if (!(idx in validOptions)) {
        var error = this._buildError("InvalidParam", "Invalid Parameter: " + idx);
        cb(error, null);
        return;
      }
    }
  }

  this._req(verb, collection + "/" + id.toString(), null, options, cb);
};

/***** This is the good part.. the part we care about *****/

// Devices
Imp.prototype.getDevices = function(options, cb) {
  var validOptions = { "device_id": true, "mac_address": true, "model_id": true, "name": true };
  this.collectionRequest("GET", "devices", options, validOptions, cb);
};

Imp.prototype.getDevice = function(deviceId, cb) {
  this.entityRequest("GET", "devices", deviceId, null, null, cb);
};

Imp.prototype.assignDevice = function(deviceId, modelId, cb) {
  var validOptions = { "model_id": true };
  this.entityRequest("PUT", "devices", deviceId, { "model_id": modelId }, validOptions, cb);
};

Imp.prototype.renameDevice = function(deviceId, deviceName, cb) {
  var validOptions = { "name": true };
  this.entityRequest("PUT", "devices", deviceId, { "name": deviceName }, validOptions, cb);
};

Imp.prototype.deleteDevice = function(deviceId, cb) {
  this.entityRequest("DELETE", "devices", deviceId, null, null, cb);
};

// Models
Imp.prototype.getModels = function(options, cb) {
  var validOptions = { "name": true };
  this.collectionRequest("GET", "models", options, validOptions, cb);
};

Imp.prototype.getModel = function(modelId, cb) {
  this.entityRequest("GET", "models", modelId, null, null, cb);
};

Imp.prototype.createModel = function(modelId, modelName, cb) {
  var validOptions = {"name": true };
  this.entityRequest("POST", "models", modelId, { "name": modelName }, validOptions, cb);
};

Imp.prototype.renameModel = function(modelId, modelName, cb) {
  var validOptions = { "name": true };
  this.entityRequest("PUT", "models", modelId, { "name": modelName }, validOptions, cb);
}

Imp.prototype.deleteModel = function(modelId, cb) {
  this.entityRequest("DELETE", "models", modelId, null, null, cb);
};

Imp.prototype.restartModel = function(modelId, cb) {
  this.collectionRequest("POST", "models/"+modelId+"/restarts", null, null, cb);
};

// Model Revisions
Imp.prototype.getModelRevisions = function(modelId, options, cb) {
  var validOptions = { "since": true, "until": true, "build_min": true, "build_max": true };
  this.collectionRequest("GET", "models/"+modelId+"/revisions", options, validOptions, cb);
};

Imp.prototype.getModelRevision = function(modelId, revisionId, cb) {
  this.entityRequest("GET", "models/"+modelId+"/revisions", revisionId, null, null, cb);
};

Imp.prototype.createModelRevision = function(modelId, model, cb) {
  var validOptions = { "device_code": true, "agent_code": true, "release_notes": true, "marker": "true" };
  this.collectionRequest("POST", "models/"+modelId+"/revisions", model, validOptions, cb);
};

module.exports = Imp;
