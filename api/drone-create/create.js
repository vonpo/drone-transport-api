const HttpStatus = require('http-status-codes');
const Drone = require('../Drone');

module.exports.create = (event, context, callback) => {
    const droneData = JSON.parse(event.body);

    Drone.create(droneData, (error, result) => {
        if (error) {
            return callback(error);
        }

        const response = {
            statusCode: HttpStatus.OK,
            body: result,
        };
        callback(null, response);
    });
};