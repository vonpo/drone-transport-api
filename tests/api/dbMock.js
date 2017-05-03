/**
 * Mock basic db methods:
 * scan, get, put.
 */
class DbMock {
    constructor() {
        this.drones = require('../../api/list/drones.json').drones;
    }

    scan(params, done) {
        return new Promise(resolve => {
            if (typeof done === 'function') {
                done(null, {Items: this.drones});
            }

            resolve({Items: this.drones});
        })
    }

    update(params, done) {
        this.get(params)
            .then(drone => {
                if (typeof done === 'function') {
                    done();
                }

                drone.Item.booking = params.ExpressionAttributeValues[':booking'];
            })
    }

    get(params, done) {
        return this
            .scan({})
            .then(drones => {
                var item = drones.Items
                    .filter(drone => drone.id === params.Key.id)
                    .map(drone => ({Item: drone}))
                    .pop();

                if (typeof done === 'function') {
                    done(null, item);
                }

                return Promise.resolve(item);
            });
    }
}

module.exports = DbMock;