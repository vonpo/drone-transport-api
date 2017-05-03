const mockery = require('mockery');
const DbMock = require('../dbMock');
const expect = require('expect.js');
const allDrones = require('../../../api/list/drones.json');

var DroneList;

describe('list.spec', function () {
    before(function () {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        var dbMock = new DbMock();

        // replace the module `request` with a stub object
        mockery.registerMock('./dynamodb', dbMock);

        DroneList = require('../../../api/Drone');
    });

    it('should get list of all drones', function (done) {
        DroneList.list({}, (err, drones) => {
            expect(err).to.be(null);
            expect(Array.isArray(drones)).to.be(true);
            done();
        })
    });

    it('should get all drones', function (done) {
        DroneList.list({}, (err, drones) => {
            expect(err).to.be(null);
            expect(Array.isArray(drones)).to.be(true);
            expect(drones.length).to.be(allDrones.drones.length);
            done();
        })
    });

    it('should get drones that are close to given distance', function (done) {
        DroneList.list({
            lat: 60.160775,
            lon: 24.955536
        }, (err, drones) => {
            expect(err).to.be(null);
            expect(Array.isArray(drones)).to.be(true);
            expect(drones.length).to.be(2);
            done();
        })
    });

    it('should get only available drones', function (done) {
        DroneList.list({
            status: 'AVAILABLE'
        }, (err, drones) => {
            expect(err).to.be(null);
            expect(drones.length).to.be(3);
            done();
        })
    });

    it('should get available drones and close to given distance', function (done) {
        DroneList.list({
            lat: 60.160775,
            lon: 24.955536,
            status: 'AVAILABLE'
        }, (err, drones) => {
            expect(err).to.be(null);
            expect(drones.length).to.be(1);
            done();
        })
    });

    after(function () {
        mockery.disable();
    });
});