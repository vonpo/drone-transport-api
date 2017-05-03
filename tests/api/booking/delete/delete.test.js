const mockery = require('mockery');
const DbMock = require('../../dbMock');
const expect = require('expect.js');

var Drone, DroneBooking;

describe('booking update.spec', function () {
    before(function () {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        var dbMock = new DbMock();

        // replace the module `request` with a stub object
        mockery.registerMock('./dynamodb', dbMock);

        DroneBooking = require('../../../../api/Booking');
        Drone = require('../../../../api/Drone');
    });

    it('should clear booking', function (done) {
        var droneId = '06f4926c-8da5-4b1c-9a7d-fb0fbecc0e1b';

        DroneBooking
            .delete(droneId)
            .then(Drone.get.bind(Drone, droneId))
            .then(drone => {
                expect(typeof drone.booking).to.eql('undefined');
                expect(drone.status).to.be('AVAILABLE');
                done();
            })
    });

    after(function () {
        mockery.disable();
    });
});