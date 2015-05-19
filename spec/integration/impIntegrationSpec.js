var Imp = require("../../lib/imp");
var settings = require("./test_params.json");

return; // uncomment to run integration tests

describe("When a request with an invalid API Key is made", function() {
  var imp;

  beforeEach(function() {
    imp = new Imp({
      "apiKey": settings.invalidApiKey,
      "apiBase": settings.apiBase
    });
  });

  describe("to getDevices", function() {
    it("it should return an error", function(done) {
      imp.getDevices(null, function(err, data) {
        expect(err).not.toBe(null);
        expect(err.code).toBe("Unauthorized")

        done();
      });
    });
  });

  describe("to getDevice", function() {
    it("it should return an error", function(done) {
      imp.getDevice("123", function(err, data) {
        expect(err).not.toBe(null);
        expect(err.code).toBe("Unauthorized")

        done();
      });
    });
  });

  describe("to assignDevice", function() {
    it("it should return an error", function(done) {
      imp.assignDevice("123", "123", function(err, data) {
        expect(err).not.toBe(null);
        expect(err.code).toBe("Unauthorized")

        done();
      });
    });
  });

  describe("to renameDevice", function() {
    it("it should return an error", function(done) {
      imp.renameDevice("123", "123", function(err, data) {
        expect(err).not.toBe(null);
        expect(err.code).toBe("Unauthorized")

        done();
      });
    });
  });

  describe("to deleteDevice", function() {
    it("it should return an error", function(done) {
      imp.deleteDevice("123", function(err, data) {
        expect(err).not.toBe(null);
        expect(err.code).toBe("Unauthorized")

        done();
      });
    });
  });
    describe("to getModels", function() {
    it("it should return an error", function(done) {
      imp.getModels(null, function(err, data) {
        expect(err).not.toBe(null);
        expect(err.code).toBe("Unauthorized")

        done();
      });
    });
  });

  describe("to getModels", function() {
    it("it should return an error", function(done) {
      imp.getModel("123", function(err, data) {
        expect(err).not.toBe(null);
        expect(err.code).toBe("Unauthorized")

        done();
      });
    });
  });

  describe("to renameModel", function() {
    it("it should return an error", function(done) {
      imp.renameModel("123", "123", function(err, data) {
        expect(err).not.toBe(null);
        expect(err.code).toBe("Unauthorized")

        done();
      });
    });
  });

  describe("to deleteModel", function() {
    it("it should return an error", function(done) {
      imp.deleteModel("123", function(err, data) {
        expect(err).not.toBe(null);
        expect(err.code).toBe("Unauthorized")

        done();
      });
    });
  });

  describe("to restartModel", function() {
    it("it should return an error", function(done) {
      imp.restartModel("123", function(err, data) {
        expect(err).not.toBe(null);
        expect(err.code).toBe("Unauthorized")

        done();
      });
    });
  });

  describe("to getModelRevisions", function() {
    it("it should return an error", function(done) {
      imp.getModelRevisions("123", null, function(err, data) {
        expect(err).not.toBe(null);
        expect(err.code).toBe("Unauthorized")

        done();
      });
    });
  });

  describe("to getModelRevision", function() {
    it("it should return an error", function(done) {
      imp.getModelRevision("123", "123", function(err, data) {
        expect(err).not.toBe(null);
        expect(err.code).toBe("Unauthorized")

        done();
      });
    });
  });

  describe("to createModelRevision", function() {
    it("it should return an error", function(done) {
      imp.createModelRevision("123", {}, function(err, data) {
        expect(err).not.toBe(null);
        expect(err.code).toBe("Unauthorized")

        done();
      });
    });
  });
});


describe("When a request with a valid API Key is made", function() {
  var imp;

  beforeEach(function() {
    imp = new Imp({
      "apiKey": settings.apiKey,
      "apiBase": settings.apiBase
    });
  });

  describe("to getDevices", function() {
    it("it should return an array of devices", function(done) {
      imp.getDevices(null, function(err, data) {
        expect(err).toBe(null);

        expect(data.success).toBe(true);
        expect(data.devices.length).toBeGreaterThan(0);

        done();
      });
    });
  });

  describe("to getDevice", function() {
    describe("with a valid device_id", function() {
      it("it should return the device", function(done) {
        imp.getDevice(settings.validDeviceId, function(err, data) {
          expect(err).toBe(null);

          expect(data.success).toBe(true);
          expect(data.device).not.toBe(undefined);

          done();
        });
      });
    });
    describe("with an invalid device_id", function() {
      it("it should return an error", function(done) {
        imp.getDevice(settings.invalidDeviceId, function(err, data) {
          expect(err).not.toBe(null);
          expect(err.code).toBe("DeviceNotFound");

          done();
        });
      });
    });
  });

  describe("to assignDevice", function() {
    describe("with an invalid device_id", function() {
      it("it should return an error", function(done) {
        imp.assignDevice(settings.invalidDeviceId, settings.validModelId, function(err, data) {
          expect(err).not.toBe(null);
          expect(err.code).toBe("DeviceNotFound");
          done();
        });
      });
    });

    describe("with an invalid model_id", function () {
      it("it should return an error", function(done) {
        imp.assignDevice(settings.validDeviceId, settings.invalidDeviceId, function(err, data) {
          expect(err).not.toBe(null);
          expect(err.code).toBe("ModelNotFound");
          done();
        });
      });
    });

    describe("with a valid device_id and model_id", function() {
      it("it should assign the device", function(done) {
        imp.assignDevice(settings.validDeviceId, settings.validModelId, function(err, data) {
          expect(err).toBe(null);
          expect(data.success).toBe(true);
          expect(data.device.id).toBe(settings.validDeviceId);
          expect(data.device.model_id).toBe(settings.validModelId);
          done();
        });
      });
    });

    describe("with a valid device_id and a null model_id", function() {
      var originalModelId;

      beforeEach(function(done) {
        imp.getDevice(settings.validDeviceId, function(err, data) {
          originalModelId = data.device.model_id;
          done();
        });
      });

      afterEach(function(done) {
        imp.assignDevice(settings.validDeviceId, originalModelId, function(err, data) {
          done();
        });
      });

      it("it should unassign the device", function(done) {
        imp.assignDevice(settings.validDeviceId, null, function(err, data) {
          expect(err).toBe(null);
          expect(data.success).toBe(true);
          expect(data.device.id).toBe(settings.validDeviceId);
          expect(data.device.model_id).toBe(null);
          done();
        });
      });
    });
  });

  describe("to renameDevice", function() {
    describe("with an invalid deviceId", function() {
      it("it should return an error", function(done) {
        imp.renameDevice(settings.invalidDeviceId, "abc123", function(err, data) {
          expect(err).not.toBe(null);
          expect(err.code).toBe("DeviceNotFound");
          done();
        });
      });
    });

    describe("with an valid deviceId", function() {
      var originalDeviceName;

      beforeEach(function(done) {
        imp.getDevice(settings.validDeviceId, function(err, data) {
          originalDeviceName = data.device.name;
          done();
        });
      });

      afterEach(function(done) {
        imp.renameDevice(settings.validDeviceId, originalDeviceName, function(err,data) {
          done();
        });
      });

      it("it should rename the device", function(done) {
        var newName = Date.now().toString();
        imp.renameDevice(settings.validDeviceId, newName, function(err, data) {
          expect(err).toBe(null);
          expect(data.device.name).toBe(newName);
          done();
        });
      });
    });
  });

  describe("to deleteDevice", function() {
    describe("with an invalid deviceId", function() {
      it("it should return an error", function(done) {
        imp.deleteDevice(settings.invalidDeviceId, function(err, data) {
          expect(err).not.toBe(null);
          expect(err.code).toBe("DeviceNotFound");
          done();
        });
      });
    });

    describe("with a valid device_id", function() {
      var originalModelId;
      var originalDeviceName;

      beforeEach(function(done) {
        imp.getDevice(settings.validDeviceId, function(err, data) {
          originalModelId = data.device.model_id;
          originalDeviceName = data.device.name;

          done();
        });
      });

      afterEach(function(done) {
        imp.assignDevice(settings.validDeviceId, originalModelId, function(err, data) {
          imp.renameDevice(settings.validDeviceId, originalDeviceName, function(err, data) {
            done();
          })
        });
      });

      it("it should delete the device", function(done) {
        imp.deleteDevice(settings.validDeviceId, function(err, data) {
          expect(err).toBe(null);
          expect(data.success).toBe(true);
          imp.getDevice(settings.validDeviceId, function(err, data) {
            expect(err).toBe(null);

            done();
          });
        });
      });
    });
  });



  describe("to getModels", function() {
    it("it should return an array of models", function(done) {
      imp.getModels(null, function(err, data) {
        expect(err).toBe(null);

        expect(data.success).toBe(true);
        expect(data.models.length).toBeGreaterThan(0);

        done();
      });
    });
  });


  describe("to getModel", function() {
    describe("with a valid model_id", function() {
      it("it should return the model", function(done) {
        imp.getModel(settings.validModelId, function(err, data) {
          expect(err).toBe(null);

          expect(data.success).toBe(true);
          expect(data.model).not.toBe(undefined);

          done();
        });
      });
    });
    describe("with an invalid model_id", function() {
      it("it should return an error", function(done) {
        imp.getModel(settings.invalidModelId, function(err, data) {
          expect(err).not.toBe(null);
          expect(err.code).toBe("ModelNotFound");

          done();
        });
      });
    });
  });


  describe("to restartModel", function() {
    describe("with a valid model_id", function() {
      it("it should return success", function(done) {
        imp.restartModel(settings.validModelId, function(err, data) {
          expect(err).toBe(null);

          expect(data.success).toBe(true);

          done();
        });
      });
    });
    describe("with an invalid model_id", function() {
      it("it should return an error", function(done) {
        imp.restartModel(settings.invalidModelId, function(err, data) {
          expect(err).not.toBe(null);
          expect(err.code).toBe("ModelNotFound");

          done();
        });
      });
    });
  });


  describe("to getModelRevisions", function() {
    describe("with an invalid model_id", function() {
      it("it should return an error", function(done) {
        imp.getModelRevisions(settings.invalidModelId, null, function(err, data) {
          expect(err).not.toBe(null);
          expect(err.code).toBe("ModelNotFound");
          done();
        });
      });
    });

    describe("with a valid model_id", function() {
      it("should return an array of revisions", function(done) {
        imp.getModelRevisions(settings.validModelId, { "build_min" : 0 }, function(err, data) {
          expect(err).toBe(null);
          expect(data.success).toBe(true);

          expect(data.revisions).not.toBe(undefined);
          expect(data.revisions[0].version).not.toBe(undefined);
          expect(data.revisions[0].created_at).not.toBe(undefined);
          // expect(data.revisions[0].marker).not.toBe(undefined);

          done();
        });
      });
    });
  });

  describe("to getModelRevision", function() {
    describe("with an invalid model_id", function() {
      it("it should return an error", function(done) {
        imp.getModelRevision(settings.invalidModelId, 1, function(err, data) {
          expect(err).not.toBe(null);
          expect(err.code).toBe("ModelNotFound");
          done();
        });
      });
    });

    describe("with a valid model_id", function() {
      var lastBuild;

      beforeEach(function(done) {
        imp.getModelRevisions(settings.validModelId, null, function(err, data) {
          lastBuild = data.revisions[0].version;
          done();
        });
      });

      describe("and an invalid revisionId", function() {
        it("it should return an error", function(done) {

          imp.getModelRevision(settings.validModelId, lastBuild + 1, function(err, data) {
            expect(err).not.toBe(null);
            expect(err.code).toBe("RevisionNotFound");
            done();
          });
        });
      });
      describe("and a valid revisionId", function() {
        it("should return the revision", function(done) {
          imp.getModelRevision(settings.validModelId, lastBuild, function(err, data) {
            expect(err).toBe(null);
            expect(data.success).toBe(true);

            expect(data.revision).not.toBe(undefined);
            expect(data.revision.version).toBe(lastBuild);
            expect(data.revision.created_at).not.toBe(undefined);
            expect(data.revision.device_code).not.toBe(undefined);
            expect(data.revision.agent_code).not.toBe(undefined);
            expect(data.revision.release_notes).not.toBe(undefined);
            // expect(data.revision.marker).not.toBe(undefined);

            done();
          });
        });
      });
    });
  });

  describe("to createModelRevision", function() {
    describe("with an invalid model_id", function() {
      it("it should return an error", function(done) {
        imp.createModelRevision(settings.invalidModelId, {}, function(err, data) {
          expect(err).not.toBe(null);
          expect(err.code).toBe("ModelNotFound");
          done();
        });
      });
    });

    describe("with a valid model_id", function() {
      var time = Date.now();
      var model = {
        "device_code": "server.log(\"Device Started at: "+time+"\");",
        "agent_code": "server.log(\"Agent Started at: "+time+"\");",
        "release_notes": "Test build created at " + time,
        "marker": ""
      };

      it("it should create the revision", function(done) {
        imp.createModelRevision(settings.validModelId, model, function(err, data) {
          expect(err).toBe(null);
          expect(data.success).toBe(true);
          done();
        });
      });
    });

  });
});

