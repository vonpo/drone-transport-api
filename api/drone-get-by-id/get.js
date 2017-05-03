const HttpStatus = require('http-status-codes');
const Drone = require('../Drone');

module.exports.get = (event, context, callback) => {
    Drone.get(event.pathParameters.id, (error, result) => {
        if (error) {
            return callback(error);
        }

        if(!result) {
            callback(null, { statusCode: HttpStatus.NOT_FOUND });
            return;
        }

        // create a response
        const response = {
            statusCode: HttpStatus.OK,
            body: result,
        };
        callback(null, response);
    });
};