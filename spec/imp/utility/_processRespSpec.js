var Imp = require("../../../index.js")

describe("When the SDK processes a request", function() {
  var imp;

  beforeEach(function() {
    imp = new Imp();
  });

  describe("with an error", function() {
    it("the err param should bubble up to the callback", function(done) {
      var expectedError = "some error";

      imp._processResp(expectedError, null, null, function(err, data) {
        expect(err).toBe(expectedError);
        done();
      })
    });
  });

  describe("with a non-2xx response", function() {
    describe("and the body is empty", function() {
      it("the err param should have the error and message set to statusMessage", function(done) {
        var resp = {
          "statusCode": 401,
          "statusMessage": "Unauthorized"
        };

        imp._processResp(null, resp, null, function(err, data) {
          expect(err.errors[0].error).toBe(resp.statusMessage);
          expect(err.errors[0].message).toBe(resp.statusMessage);
          done();
        });
      });
    });

    describe("and the body doesn't contain a JSON object", function() {
      it("the err param should have the error and message set to statusMessage", function(done) {
        var resp = {
          "statusCode": 401,
          "statusMessage": "Unauthorized"
        };

        var expectedErrors = { "errors": [
          { "error": resp.statusMessage, "message": resp.statusMessage }
        ]};

        var body = "Unauthorized Request";

        imp._processResp(null, resp, body, function(err, data) {
          expect(err.errors[0].error).toBe(resp.statusMessage);
          expect(err.errors[0].message).toBe(resp.statusMessage);
          done();
        });
      });
    });

    describe("and the body contains error information", function() {
      it("the err param should should contain the errors", function(done) {
        var resp = {
          "statusCode": 401,
          "statusMessage": "Unauthorized"
        };
        var body = {
          "success": "false",
          "errors": [
            { "error": "err1", "message": "the first error"},
            { "error": "err2", "message": "the second error"},
          ]
        };

        imp._processResp(null, resp, body, function(err, data) {
          expect(err.errors[0]).toBe(body.errors[0]);
          expect(err.errors[1]).toBe(body.errors[1]);
          done();
        });
      });
    });
    describe("and the body doesn't contains error information", function() {
      it("the err param should have the error and message set to statusMessage", function(done) {
        var resp = {
          "statusCode": 401,
          "statusMessage": "Unauthorized"
        };
        var body = {
          "success": "false",
        };

        imp._processResp(null, resp, body, function(err, data) {
          expect(err.errors[0].error).toBe(resp.statusMessage);
          expect(err.errors[0].message).toBe(resp.statusMessage);
          done();
        });
      });
    });
  });

  describe("with a 2xx response", function() {
    it("the data parameter should be set to the body", function(done) {
      var resp = {
        "statusCode": 200,
        "statusMessage": "Ok"
      };

      var body = {
        "success": "true"
      }

      imp._processResp(null, resp, body, function(err, data) {
        expect(err).toBe(null);
        expect(data).toBe(body);
        done();
      });
    });
  });
});
