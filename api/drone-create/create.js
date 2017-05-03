const HttpStatus = require('http-status-codes');
const Drone = require('../Drone');

module.exports.create = (event, context, callback) => {
    const droneData = JSON.parse(event.body);

    Drone
        .create(droneData)
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
        })
};