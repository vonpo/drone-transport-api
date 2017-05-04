const mockery = require('mockery');
const DbMock = require('../../dbMock');
const expect = require('expect.js');

var Drone;

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

        Drone = require('../../../../api/Drone');
    });

    it('should create new drone', function (done) {
        var droneData = {
            name : 'Test Drone1',
            speed: 1,
            location: {
                lat: 60.165679,
                lon: 24.952612
            }
        };

        Drone
            .create(droneData)
            .then(Drone.get.bind(Drone))
            .then(drone => {
                expect(drone.name).to.be(droneData.name);
                expect(drone.location).to.eql(droneData.location);
                expect(drone.speed).to.eql(1);
                done();
            })
    });

    it('should not create new drone when data is invalid', function (done) {
        var droneData = {
            location: {
                lat: 60.165679,
                lon: 24.952612
            }
        };

        Drone
            .create(droneData)
            .catch(error => {
                expect(error.reason).to.be('Invalid drone data.');
                done();
            })
    });

    after(function () {
        mockery.disable();
    });
});