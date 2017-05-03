const Booking = require('../Booking');
const HttpStatus = require('http-status-codes');

module.exports.update = (event, context, callback) => {
    const droneData = JSON.parse(event.body);
    droneData.droneId = event.pathParameters.id;

    Booking.update(droneData)
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