const dynamodb = require('./dynamodb');
const MAX_DISTANCE = 500; // meters
const geolib = require('geolib');

const filterByDistance = (distance, userCoordinates) => item => {
    var distance = geolib.getDistance(userCoordinates, {
        latitude: item.location.lat,
        longitude: item.location.lon
    });

    return distance <= MAX_DISTANCE;
};

function checkDistance(queryString) {
    var shouldCheckDistance = queryString && !isNaN(queryString.lat) && !isNaN(queryString.lon);

    if (shouldCheckDistance) {
        let userCoordinates = {
            latitude: queryString.lat,
            longitude: queryString.lon
        };

        return filterByDistance(MAX_DISTANCE, userCoordinates);
    } else {
        return () => true;
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
    if(!item) {
        return;
    }

    item.status = item.booking ? 'BUSY': 'AVAILABLE';

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
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
    };

    dynamodb.scan(params, (error, result) => {
        if (error) {
            callback(new Error('Couldn\'t fetch the drones.'));
            return;
        }
        var items = result.Items
            .map(mapProperties)
            .filter(checkDistance(queryString))
            .filter(checkAvailability(queryString));

        callback(null, items);
    });
};

module.exports.get = function get(id, callback) {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: id
        }
    };

    return dynamodb
        .get(params)
        .then(result => {
            if (typeof callback !== 'undefined') {
                callback(null, result && result.Item);
            }
            mapProperties(result && result.Item);
            return Promise.resolve(result && result.Item);
        })
};