# imp.js

A Javascript wrapper for [Electric Imp](http://electricimp.com)'s Developer Tools API.

**NOTE:** Electric Imp's Developer Tools API is currently in a private beta. This note will be removed when the API is ready for public consumption.

# Installation

```
npm install imp-api
```

## Instantation

The imp object *must* be instantiated with an apiKey - you can optionally pass an apiBase and apiVersion parameter to overload the defaults.

```javascript
var Imp = require("imp");

var imp = new Imp({
  "apiKey": "<-- YOUR API KEY -->"
});
```

## imp.getDevices(options, callback)

Returns a list of devices associted to the account. You can pass a table with any of the following options to filter the list: ```device_id```, ```mac_address```, ```model_id```, ```name```.

```javascript
// get all devices with 'test' in the name
imp.getDevices({ "name": "test", function(err, data) {
  if (err) {
    console.log(err);
    return;
  }

  data.devices.forEach(function(device) {
    console.log(device);
  });
});
```


## imp.getDevice(deviceId, callback)

Returns information about a specific device.

```javascript
imp.getDevice("<-- device_id -->", function(err, data) {
  if(err) {
    console.log(err);
    return;
  }

  console.log(data);
});
```

## imp.assignDevice(deviceId, modelId, callback)

Assigns a device to a specific model, and immediatly starts running the code.

```javascript
imp.assignDevice("<-- device_id -->", "<-- model_id -->", function(err, data) {
  if (err) {
    console.log(err);
    return;
  }

  console.log("Success!!");
});
```

Passing ```null``` as the modelId will unassign the device from it's current model.

## imp.deleteDevice(deviceId, callback)

Deletes a device from your account (note: the next time the device comes online / communicates with the Electric Imp service it will re-register itself with your account).

```javascript
imp.deleteDevice("<-- device_id -->", function(err, data) {
  if (err) {
    console.log(err);
    return;
  }

  console.log("Success!!");
});
```

## imp.getModels(options, callback)

Returns a list of models associted to the account. You can pass a table with any of the following options to filter the list: ```name```.

```javascript
// get all models with 'test' in the name
imp.getModels({ "name": "test", function(err, data) {
  if (err) {
    console.log(err);
    return;
  }

  data.models.forEach(function(model) {
    console.log(model);
  });
});
```

## imp.getModel(modelId, callback)

Returns information about a specific model.

```javascript
imp.getModel("<-- model_id -->", function(err, data) {
  if(err) {
    console.log(err);
    return;
  }

  console.log(data);
});
```

## imp.createModel(options, callback)

Creates a new model in the associated account.

```javascript
imp.createModel("New Model Name", function(err, data) {
  if(err) {
    console.log(err);
    return;
  }

  console.log("Success - created model with id: " + data.model.id);
});
```

## imp.restartModel(modelId, callback)

Restarts all devices and agents associated to a model.

```javascript
imp.restartModel("<-- model_id -->", function(err, data) {
  if(err) {
    console.log(err);
    return;
  }

  console.log("Success!!");
});
```

## imp.deleteModel(modelId, callback)

Deletes the specified model and all code associated with it - you cannot delete a model that has devices assigned to it.

```javascript
imp.deleteModel("<-- model_id -->", function(err, data) {
  if(err) {
    console.log(err);
    return;
  }

  console.log("Success!!");
});
```

## imp.getModelRevisions(modelId, options, callback)

Returns a list of code revisions for the specified model. You can pass a table with any of the following options to filter the list: ```since```, ```until```, ```build_min```, ```build_max```.

```javascript
// 1800000 milliseconds = 30 minutes
var thirtyMinutesAgo = Date.now() - 1800000;

imp.getModelRevisions("<-- model_id -->", { "since": thirtyMinutesAgo }, function(err, data) {
  if (err) {
    console.log(err);
    return;
  }

  data.revisions.forEach(function(revision) {
    console.log(revision);
  });
});
```

## imp.getModelRevision(modelId, version, callback)

Returns the code and metadata of a specified version.

```javascript
imp.getModelRevision("<-- model_id -->", versionNumber, function(err, data) {
  if (err) {
    console.log(err);
    return;
  }

  console.log(data.revision);
});
```


## imp.createModelRevision(modelId, model, callback)

Pushes a new revision to the model. After creating a new revision, you need to call ```restartModel``` for the code to be sent to the devices assigned to the specified model. The model object **must** contain ```agent_code``` and ```device_code``` and can also include ```release_notes``` and ```marker``` (63 characters max that can be used like GIT tags).

```javascript
var deviceCode = "server.log(\"Device Started!\");";
var agentCode = "server.log(\"Agent Started!\");";

var model = { "device_code": deviceCode, "agent_code": agentCode };

imp.createModelRevision("<-- model_id -->", model, function(err, data) {
  if (err) {
    console.log(err);
    return;
  }

  imp.restartModel("<-- model_id -->", function(err, data) {
    if (err) {
      console.log(err);
      return;
    }

    console.log("Success!");
  });
});
```

# Tests

To run the full test suite, you will first need to create ```/spec/integration/test_params.json``` which should have the following content:

```javascript
{
  "apiKey" : "<-- Your API Key -->",
  "invalidApiKey" : "abc123",

  "invalidDeviceId" : "abc123",
  "invalidDeviceName" : "zxydl",

  "validDeviceId" : "<-- A deviceId from your account -->",
  "validDeviceName": "<-- A device name from your account -->",

  "invalidModelId" : "abc123",
  "invalidModelName": "zxydl",

  "validModelId" : "<-- A modelId from your account -->",
  "validModelName" : "<-- A model name from your account -->",


  "apiBase" : "api.electricimp.com"
}
```

To run the test suite, run ```jasmine``` from the root folder of the project.


# LICENSE

imp.js is licenced under the [MIT License](./LICENSE).
