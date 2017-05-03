const mockery = require('mockery');
const DbMock = require('../../dbMock');
const expect = require('expect.js');

var Drone, DroneBooking;

describe('booking crete.spec', function () {
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

    it('should create new drone booking', function (done) {
        var droneId = '74127a79-b8df-4d96-a1e2-e21c4ef26272';

        DroneBooking
            .create({
                droneId: droneId,
                route: {
                    from: {lat: 1, lon: 2},
                    to: {lat: 1, lon: 3}
                }
            })
            .then(Drone.get.bind(Drone, droneId))
            .then(drone => {
                expect(drone.booking.route.from).to.eql({lat: 1, lon: 2});
                expect(drone.booking.route.to).to.eql({lat: 1, lon: 3});
                expect(drone.status).to.be('BUSY');
                done();
            })
    });

    it('should not create drone booking when it is busy', function (done) {
        var droneId = 'c0be73af-5be5-401d-b678-abd896837660';

        DroneBooking
            .create({
                droneId: droneId,
                route: {
                    from: {lat: 1, lon: 2},
                    to: {lat: 1, lon: 3}
                }
            })
            .catch(error => {
                expect(error.reason).to.be('Drone is busy');
                done();
            })
    });

    after(function () {
        mockery.disable();
    });
});