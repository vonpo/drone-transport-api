const mockery = require('mockery');
const DbMock = require('../dbMock');
const expect = require('expect.js');

var Drone;

describe('get.spec', function () {
    before(function () {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        var dbMock = new DbMock();

        // replace the module `request` with a stub object
        mockery.registerMock('./dynamodb', dbMock);

        Drone = require('../../../api/Drone');
    });

    it('should get NOT_FOUND when id is not found', function (done) {
        Drone.get({
            id: 'wrong_id'
        }, (err, drone) => {
            expect(typeof drone).to.be('undefined');
            done();
        })
    });

    it('should found drone by id', function (done) {
        Drone.get('c0be73af-5be5-401d-b678-abd896837660', (err, drone) => {
            expect(err).to.be(null);
            expect(drone.id).to.be('c0be73af-5be5-401d-b678-abd896837660');
            done();
        })
    });

    after(function () {
        mockery.disable();
    });
});