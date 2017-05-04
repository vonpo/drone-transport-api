const moment = require('moment');
const geolib = require('geolib');

/***
 * Calculate route time
 * It's based on drone speed and distance between points
 * Route is calculated with this formular
 *  v = d/t
 *  t = d/v
 *  v - velocity
 *  t - time
 *  d - distance
 * @param first {Object} coords
 * @param next {Object} coords
 * @param drone {Object} drone
 * @return {Object} route start and end time
 */
function getRouteTime(first, next, drone) {
    var distance = geolib.getDistance(first, next);
    var time = distance / drone.speed;

    var base = moment().add(10, 'minutes'); // add constant 10 minutes to time when drone is ready
    var start = base.valueOf();
    var end = base.add(time, 'seconds').valueOf();

    return {
        startTime: start,
        endTime: end
    }
}

module.exports.getRouteTime = getRouteTime;