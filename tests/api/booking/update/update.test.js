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

    it('should not update empty booking', function (done) {
        var droneId = '74127a79-b8df-4d96-a1e2-e21c4ef26272';

        DroneBooking
            .update({
                droneId: droneId,
                route: {
                    from: {lat: 1, lon: 2},
                    to: {lat: 1, lon: 3}
                }
            })
            .catch(error => {
                expect(error.reason).to.be('Cannot update empty booking');
                done();
            })
    });

    it('should update booking with new params', function (done) {
        var droneId = '06f4926c-8da5-4b1c-9a7d-fb0fbecc0e1b';

        DroneBooking
            .update({
                droneId: droneId,
                route: {
                    from: {lat: 5, lon: 6},
                    to: {lat: 7, lon: 8}
                }
            })
            .then(Drone.get.bind(Drone, droneId))
            .then(drone => {
                expect(drone.booking.route.from).to.eql({lat: 5, lon: 6});
                expect(drone.booking.route.to).to.eql({lat: 7, lon: 8});
                expect(typeof drone.booking.route.startTime).to.be('number');
                expect(typeof drone.booking.route.endTime).to.be('number');
                expect(drone.status).to.be('BUSY');
                done();
            })
    });

    it('should not update booking with wrong params', function (done) {
        var droneId = '06f4926c-8da5-4b1c-9a7d-fb0fbecc0e1b';

        DroneBooking
            .update({
                droneId: droneId,
                route: {
                    from: {lat: 5, lon: 6}
                }
            })
            .catch(error => {
                expect(error.reason).to.be('Invalid booking data');
                done();
            })
    });

    after(function () {
        mockery.disable();
    });
});