var async = require('async');

var expect = require('chai').expect;
var assert = require('chai').assert;
var lockerModule = require('../src/lockerz');
var lockerService = new lockerModule.LockerService(1000, 1000, 1000);

describe("Lockerz: tests", function() {
    function acquireLocker(done) {
        var locker = lockerService.acquireLocker('LARGE');
        expect(locker).not.to.be.undefined;
        assert(locker.indexOf('LARGE') != -1, "Invalid locker type returned");
        assert(lockerService.isAcquired(locker) === true, "Locker isn't acquired");
        done(null, locker);
    }

    function releaseLocker(ticketId, done) {
        var success = lockerService.releaseLocker(ticketId);
        assert(success === true, "Failed to release locker");
        assert(lockerService.isReleased(ticketId) === true, "Locker isn't released");
        done(null);
    }

    it('Get locker', function(done) {
        acquireLocker(done);
    });

    it('Return locker', function(done) {
        async.waterfall([
            acquireLocker,
            releaseLocker
        ], done);
    });

    it('Get locker unsupported', function(done) {
        var locker = lockerService.acquireLocker('XLARGE');
        assert(locker === null, "Found unsupported locker");
        done();
    });

    it('Return locker unacquired', function(done) {
        var success = lockerService.releaseLocker('MEDIUM-100');
        assert(success === false, 'Released unacquired locker');
        done();
    });

    it('Get exhausted locker type', function(done) {
        for(var i = 0; i < 1000; i++) {
            lockerService.acquireLocker('SMALL');
        }
        var locker = lockerService.acquireLocker('SMALL');
        expect(locker).not.to.be.undefined;
        assert(locker !== null, "Failed to acquire lock");
        assert(locker.indexOf('MEDIUM') != -1, "Invalid locker type returned");
        assert(lockerService.isAcquired(locker) === true, "Locker isn't acquired");
        done();
    });

    it('Check all acquired case', function(done) {
        for(var i = 0; i < 3000; i++) {
            lockerService.acquireLocker('SMALL');
        }
        var locker = lockerService.acquireLocker('SMALL');
        assert(locker === null, "Found locker ever after all were acquired");
        done();
    });
});
