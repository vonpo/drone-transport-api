const HttpStatus = require('http-status-codes');
const Drone = require('../Drone');

module.exports.get = (event, context, callback) => {
    Drone
        .get(event.pathParameters.id)
        .then(droneData => {
            if (!droneData) {
                callback(null, {statusCode: HttpStatus.NOT_FOUND});
                return;
            }

            // create a response
            const response = {
                statusCode: HttpStatus.OK,
                body: droneData,
            };
            callback(null, response);
        })
        .catch(error => {
            const response = {
                statusCode: HttpStatus.BAD_REQUEST,
                body: error,
            };
            callback(null, response)
        });
};