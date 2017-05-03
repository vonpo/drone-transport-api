const dynamodb = require('./dynamodb');
const Drone = require('./Drone');

function areValidCoords(coords) {
    if (typeof coords === 'undefined' || !coords) {
        return false;
    } else if (isNaN(coords.lat) || isNaN(coords.lon)) {
        return false;
    }

    return true;
}

function isValidRoute(route) {
    if (typeof route === 'undefined' || !route) {
        return false;
    } else if (!areValidCoords(route.from) || !areValidCoords(route.to)) {
        return false;
    }

    return true;
}

function addBookingToDrone(data) {
    return function (drone) {
        if (drone.status === 'BUSY') {
            return Promise.reject({reason: 'Drone is busy'})
        } else if (!isValidRoute(data.route)) {
            return Promise.reject({reason: 'Invalid booking data'})
        }

        drone.booking = {route: data.route};
        drone.status = 'BUSY';

        return Promise.resolve(drone);
    }
}

function updateBooking(data) {
    return function (drone) {
        if (drone.status === 'AVAILABLE') {
            return Promise.reject({reason: 'Cannot update empty booking'})
        } else if (!isValidRoute(data.route)) {
            return Promise.reject({reason: 'Invalid booking data'})
        }

        drone.booking.route = data.route;

        return Promise.resolve(drone);
    }
}

function deleteBooking(drone) {
    if (drone.status === 'AVAILABLE') {
        return Promise.reject({reason: 'Cannot delete empty booking'})
    }

    drone.status = 'AVAILABLE';
    delete drone.booking;

    return Promise.resolve(drone);
}

function updateDrone(drone, done) {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: drone.id
        },
        ExpressionAttributeValues: {
            ':booking': drone.booking
        },
        UpdateExpression: 'SET booking = :booking',
        ReturnValues: 'ALL_NEW'
    };

    return dynamodb.update(params, done);
}

/**
 * Create drone booking.
 * It allows to create booking on drones that are not busy.
 * @param data {object} Drone data.
 */
module.exports.create = function (data) {
    return Drone
        .get(data.droneId)
        .then(addBookingToDrone(data))
        .then(updateDrone);
};

/**
 * Update drone booking.
 * It allows to update booking on drones that are busy.
 * @param data {object} Drone data.
 */
module.exports.update = function (data) {
    return Drone
        .get(data.droneId)
        .then(updateBooking(data))
        .then(updateDrone);
};

/**
 * Delete drone booking.
 * Deletes booking on drones that are busy.
 * @param data {object} Drone data.
 */
module.exports.delete = function(data) {
    return Drone
        .get(data.droneId)
        .then(deleteBooking)
        .then(updateDrone);
};