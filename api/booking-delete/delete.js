const Booking = require('../Booking');
const HttpStatus = require('http-status-codes');

module.exports.delete = (event, context, callback) => {
    Booking.delete(event.pathParameters.id, (error, result) => {
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