# imp.js

A Javascript wrapper for [Electric Imp](http://electricimp.com)'s Developer Tools API (currently in closed beta).

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

## imp.getDevice(deviceId, callback)

## imp.assignDevice(deviceId, modelId, callback)

## imp.deleteDevice(deviceId, callback)

## imp.getModels(options, callback)

## imp.getModel(modelId, callback)

## imp.createModel(options, callback)

## imp.restartModel(modelId, callback)

## imp.deleteModel(modelId, callback)

## imp.getModelRevisions(modelId, options, callback)

## imp.getModelRevision(modelId, version, callback)

## imp.createModelRevision(modelId, model, callback)


# Tests

To run the full test suite, you will first need to create ```/spec/integration/test_params.json``` which should have the following content:

```
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
