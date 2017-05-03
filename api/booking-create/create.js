const Booking = require('../Booking');
const HttpStatus = require('http-status-codes');

module.exports.create = (event, context, callback) => {
    const droneData = JSON.parse(event.body);

    Booking.create(droneData)
        .then(result => {
                const response = {
                    statusCode: HttpStatus.OK,
                    body: JSON.stringify(result),
                };
                callback(null, response);
            }
        )
        .catch(error => {
            const response = {
                statusCode: HttpStatus.BAD_REQUEST,
                body: JSON.stringify(error),
            };
            callback(null, response)
        });
};