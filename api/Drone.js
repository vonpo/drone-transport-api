const MAX_DISTANCE = 500; // meters
const geolib = require('geolib');
const uuid = require('uuid');
const validators = require('./validators');
const dynamodb = require('./dynamodb');
const utils = require('./utils');

const filterByDistance = (distance, userCoordinates) => item => {
    var distance = geolib.getDistance(userCoordinates, {
        latitude: item.location.lat,
        longitude: item.location.lon
    });

    return distance <= MAX_DISTANCE;
};

function checkDistance(queryString) {
    var hasFromCoords = validators.areValidCoords(queryString.from);
    var hasToCoords = validators.areValidCoords(queryString.to);

    if (hasFromCoords && !hasToCoords) {
        return filterByDistance(MAX_DISTANCE, queryString.from);
    } else {
        return () => true; // return all items
    }
}

function processDistance(queryString) {
    var hasFromCoords = validators.areValidCoords(queryString.from);
    var hasToCoords = validators.areValidCoords(queryString.to);

    if (hasFromCoords && hasToCoords) {
        return (acc, next) => {
            if (next.booking) { // ignore booked drones
                return acc;
            }

            var routeTime = utils.getRouteTime(queryString.from, queryString.to, next);
            next.route = {
                from: queryString.from,
                to: queryString.to,
                startTime: routeTime.startTime,
                endTime: routeTime.endTime,
            };

            acc.push(next);
            return acc;
        };
    } else { // return all items
        return (acc, next) => {
            acc.push(next);
            return acc;
        };
    }
}

function checkAvailability(queryString) {
    var shouldCheckAvailability = queryString && queryString.status;

    if (shouldCheckAvailability) {
        return item => {
            return item.status === queryString.status;
        }
    } else {
        return () => true;
    }
}

function mapProperties(item) {
    if (!item) {
        return;
    }

    item.status = item.booking ? 'BUSY' : 'AVAILABLE';

    return item;
}

/**
 * List drones that matches givien params.
 * @param queryString {Object} it has params lat, lon and status.
 *  Lat is float.
 *  Lon is float.
 *  Status is ['AVAILABLE', 'BUSY']
 * @param callback {function} Callback function.
 */
module.exports.list = function list(queryString, callback) {
    queryString = queryString || {};
    queryString.from = {
        lat: queryString.fromLat,
        lon: queryString.fromLon
    };
    queryString.to = {
        lat: queryString.toLat,
        lon: queryString.toLon
    };

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
    };

    dynamodb.scan(params, (error, result) => {
        if (error) {
            callback(error);
            return;
        }

        var items = result.Items
            .map(mapProperties)
            .filter(checkDistance(queryString))
            .filter(checkAvailability(queryString))
            .map(function(x) {
                return x;
            })
            .reduce(processDistance(queryString), []);

        callback(null, items);
    });
};

/***
 * Get drone by id.
 * @param id {string}
 * @returns {Promise}
 */
module.exports.get = function get(id) {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: id
        }
    };

    return new Promise((resolve, reject) => {
        dynamodb
            .get(params, (err, result) => {
                if (err) {
                    return reject(err);
                }

                mapProperties(result && result.Item);
                resolve(result && result.Item);
            })
    });
};

/***
 * Validate drone data and create new drone.
 * @param data {object}
 * @returns {Promise}
 */
module.exports.create = function (data) {
    if (!validators.isValidDrone(data)) {
        var error = {reason: 'Invalid drone data.'};

        if (typeof  callback === 'function') {
            callback(error);
        }

        return Promise.reject(error)
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            id: uuid.v1(),
            name: data.name,
            location: data.location,
            speed: data.speed
        }
    };

    return new Promise((response, reject) => {
        dynamodb.put(params, (err, data) => {
            if (err) {
                return reject(err);
            }

            return response(data);
        });
    });
};