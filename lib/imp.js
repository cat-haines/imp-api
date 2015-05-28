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

Imp.prototype._buildUrl = function(path, includeVersion) {
  // default value is true
  if (includeVersion === undefined) includeVersion = true;

  // Setup base API
  var url = "https://" + this.apiBase + "/";

  // Add version if required
  if (includeVersion) url += this.apiVersion + "/";

  // Finally, add path
  url += path;

  return url;
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
    options.qs = body;
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

Imp.prototype.apiRequest = function(verb, path, options, validOptions, cb) {
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

  this._req(verb, path, null, options, cb);
};


/***** This is the good part.. the part we care about *****/

// Devices
Imp.prototype.getDevices = function(options, cb) {
  var validOptions = { "device_id": true, "mac_address": true, "model_id": true, "name": true };
  this.apiRequest("GET", "devices", options, validOptions, cb);
};

Imp.prototype.getDevice = function(deviceId, cb) {
  this.apiRequest("GET", "devices/"+deviceId, null, null, cb);
};

Imp.prototype.assignDevice = function(deviceId, modelId, cb) {
  var validOptions = { "model_id": true };
  this.apiRequest("PUT", "devices/"+deviceId, { "model_id": modelId }, validOptions, cb);
};

Imp.prototype.renameDevice = function(deviceId, deviceName, cb) {
  var validOptions = { "name": true };
  this.apiRequest("PUT", "devices/"+deviceId, { "name": deviceName }, validOptions, cb);
};

Imp.prototype.deleteDevice = function(deviceId, cb) {
  this.apiRequest("DELETE", "devices/"+deviceId, null, null, cb);
};

// Device Logs
Imp.prototype.getDeviceLogs = function(deviceId, options, cb) {
  var validOptions = { "since": true, "type": true, "wait_s": true, "token": true };
  this.apiRequest("GET", "devices/"+deviceId+"/logs", options, validOptions, cb);
};

Imp.prototype._getQueryParams = function(url) {
  var params = {};
  var paramArray = url.split("?")[1].split("&");
  for(var p in paramArray) {
    var splitParam = paramArray[p].split("=");
    params[splitParam[0]] = splitParam[1];
  }
  return params;
}

Imp.prototype.streamDeviceLogs = function(deviceId, cb, options) {
  // Build options
  if (!options) options = {};
  if (!("since" in options)) options.since = new Date().toISOString();

  var lastTS = options.since;

  this.getDeviceLogs(deviceId, options, function(err, data) {
    // reset options:
    options = {};

    // If there was an expected error:
    if (err) {
      // if it's a token error, open a new stream from last timestamp
      if(err.code == "InvalidToken") {
        this.streamDeviceLogs(deviceId, cb, { "since": lastTS });
        return;
      }

      // for any other error, invoke the callback and stop streaming
      cb(err, null);
      return;
    }

    // Get the parameters from poll_url:
    var params = this._getQueryParams(data.poll_url);
    if ("token" in params) options.token = params.token;
    if ("wait_s" in params) options.wait_s = params.wait_s;

    // If there were logs, update the last timestamp incase anything goes wrong
    if (data.logs.length > 0) lastTS = data.logs[data.logs.length-1].timestamp;

    // fire off a new request
    this.streamDeviceLogs(deviceId, cb, options);

    // invoke the callback
    cb(null, data);
  }.bind(this));
}

// Models
Imp.prototype.getModels = function(options, cb) {
  var validOptions = { "name": true };
  this.apiRequest("GET", "models", options, validOptions, cb);
};

Imp.prototype.getModel = function(modelId, cb) {
  this.apiRequest("GET", "models/"+modelId, null, null, cb);
};

Imp.prototype.createModel = function(modelName, cb) {
  var validOptions = {"name": true };
  this.apiRequest("POST", "models", { "name": modelName }, validOptions, cb);
};

Imp.prototype.renameModel = function(modelId, modelName, cb) {
  var validOptions = { "name": true };
  this.apiRequest("PUT", "models/"+modelId, { "name": modelName }, validOptions, cb);
};

Imp.prototype.deleteModel = function(modelId, cb) {
  this.apiRequest("DELETE", "models/"+modelId, null, null, cb);
};

Imp.prototype.restartModel = function(modelId, cb) {
  this.apiRequest("POST", "models/"+modelId+"/restarts", null, null, cb);
};

// Model Revisions
Imp.prototype.getModelRevisions = function(modelId, options, cb) {
  var validOptions = { "since": true, "until": true, "build_min": true, "build_max": true };
  this.apiRequest("GET", "models/"+modelId+"/revisions", options, validOptions, cb);
};

Imp.prototype.getModelRevision = function(modelId, revisionId, cb) {
  this.apiRequest("GET", "models/"+modelId+"/revisions/"+revisionId, null, null, cb);
};

Imp.prototype.createModelRevision = function(modelId, model, cb) {
  var validOptions = { "device_code": true, "agent_code": true, "release_notes": true, "marker": "true" };
  this.apiRequest("POST", "models/"+modelId+"/revisions", model, validOptions, cb);
};

module.exports = Imp;
