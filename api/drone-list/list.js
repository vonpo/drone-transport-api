const Drone = require('../Drone');
const HttpStaus = require('http-status-codes');

module.exports.list = (event, context, callback) => {
    Drone.list(event.queryStringParameters, (error, result) => {
        if (error) {
            return callback(error);
        }

        const response = {
            statusCode: HttpStaus.OK,
            body: {drones: result},
        };

        callback(null, response);
    });
};