function areValidCoords(coords) {
    if (typeof coords !== 'object') {
        return false;
    } else if (isNaN(coords.lat) || isNaN(coords.lon)) {
        return false;
    }

    return true;
}

module.exports.areValidCoords = areValidCoords;
module.exports.isValidRoute = function (route) {
    if (typeof route !== 'object') {
        return false;
    } else if (!areValidCoords(route.from) || !areValidCoords(route.to)) {
        return false;
    }

    return true;
};

module.exports.isValidDrone = function (droneData) {
    if (typeof droneData !== 'object') {
        return false;
    } else if (typeof droneData.name !== 'string' || droneData.name.length === 0) {
        return false;
    } else if (!areValidCoords(droneData.location)) {
        return false;
    }

    return true;
};

