const dynamodb = require('./dynamodb');
const Drone = require('./Drone');
const validators = require('./validators');
const utils = require('./utils');

function addBookingToDrone(data) {
    return function (drone) {
        if (typeof drone !== 'object') {
            return Promise.reject({reason: 'Drone not found'})
        } else if (drone.status === 'BUSY') {
            return Promise.reject({reason: 'Drone is busy'})
        } else if (!validators.isValidRoute(data.route)) {
            return Promise.reject({reason: 'Invalid booking data'})
        }

        var routeTime = utils.getRouteTime(data.route.from, data.route.to, drone);

        drone.booking = {
            route: {
                from: data.route.from,
                to: data.route.to,
                startTime: routeTime.startTime,
                endTime: routeTime.endTime
            }
        };

        drone.status = 'BUSY';

        return Promise.resolve(drone);
    }
}

function updateBooking(data) {
    return function (drone) {
        if (typeof drone !== 'object') {
            return Promise.reject({reason: 'Drone not found'})
        } else if (drone.status === 'AVAILABLE') {
            return Promise.reject({reason: 'Cannot update empty booking'})
        } else if (!validators.isValidRoute(data.route)) {
            return Promise.reject({reason: 'Invalid booking data'})
        }

        var routeTime = utils.getRouteTime(data.route.from, data.route.to, drone);

        drone.booking.route = {
            from: data.route.from,
            to: data.route.to,
            startTime: routeTime.startTime,
            endTime: routeTime.endTime
        };

        return Promise.resolve(drone);
    }
}

function deleteBooking(drone) {
    if (drone.status === 'AVAILABLE') {
        return Promise.reject({reason: 'Cannot delete empty booking'})
    }

    drone.status = 'AVAILABLE';
    drone.booking = null;

    return Promise.resolve(drone);
}

function updateDrone(drone) {
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

    return new Promise((resolve, reject) => {
        dynamodb.update(params, (err, result) => {
            (err) ? reject(err) : resolve(result);
        });
    })
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
 * @param droneId {string} Drone id.
 */
module.exports.delete = function (droneId) {
    return Drone
        .get(droneId)
        .then(deleteBooking)
        .then(updateDrone);
};