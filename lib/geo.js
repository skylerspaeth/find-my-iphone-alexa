module.exports = {
    getDistanceBetweenTwoCoordinates: getDistanceBetweenTwoCoordinates
}

const R = 6371; // Radius of the earth in km

// Pair1 = Device location
// Pair2 = Home location
function getDistanceBetweenTwoCoordinates(lat1,lon1,lat2,lon2, options) {

    // Define defaults options, but allow the caller to override some of them.
    // Then check that the options are valid.
    options = Object.assign({ units:'km' }, options || {}); // Also be careful in case they didn't provided any.
    if (options.units != 'km' && options.units != 'mi') {
        throw 'Invalid units ' + options.units
    }

    const dLat = deg2rad(lat2-lat1);  // deg2rad below
    const dLon = deg2rad(lon2-lon1); 

    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 

    var ret = R * c; // Distance in km
    if (options.units === 'mi') {
        ret = ret*0.62137; // Distance in mi
    }

    console.log(options.units, 'calculated distance', ret);
    return ret;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function test() {
    const lat1 = 30.233769;
    const lon1 = -97.878493;
    const lat2 = 30.231678;
    const lon2 = -97.883359;
    const correctDistance = 0.3244237217508202;
    const distanceInMiles = module.exports.getDistanceBetweenTwoCoordinates(lat1, lon1, lat2, lon2, {units:'mi'});

    if (distanceInMiles !== correctDistance) {
        throw 'Distance calculations in miles are not working; expected ' + correctDistance + ' but got ' + distanceInMiles;
    }
}
