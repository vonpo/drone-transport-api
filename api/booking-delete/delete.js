const Booking = require('../Booking');
const HttpStatus = require('http-status-codes');

module.exports.delete = (event, context, callback) => {
    Booking.delete(event.pathParameters.id)
        .then(result => {
            const response = {
                statusCode: HttpStatus.OK,
                body: result,
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