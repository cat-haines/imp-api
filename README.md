# imp.js

A Javascript wrapper for [Electric Imp](http://electricimp.com)'s Developer Tools API (currently in closed beta).

## Installation

```
npm install imp.js
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

# LICENSE

imp.js is licenced under the [MIT License](./LICENSE).
