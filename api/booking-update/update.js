const Booking = require('../Booking');
const HttpStatus = require('http-status-codes');

module.exports.create = (event, context, callback) => {
    const droneData = JSON.parse(event.body);
    droneData.id = event.pathParameters.id;

    Booking.update(droneData, (error, result) => {
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