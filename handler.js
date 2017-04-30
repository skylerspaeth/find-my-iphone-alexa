'use strict';

const getDeviceByName = require('./device-config').findDevice;
const config = require('./config');
const axios = require('axios');
const geo = require('./lib/geo');

module.exports.findMyIphone = (event, context, callback) => {

    const relationship = event.request.intent.slots.relationship.value;
    const deviceType = event.request.intent.slots.device.value;
    const deviceNameRequested = getDeviceByName(relationship, deviceType);
    console.log('Device Logic', {relationship:relationship, deviceType:deviceType, deviceNameRequested:deviceNameRequested});

    getIcloud().getFindableDevices(function(err, devices) {
        if (err) { callback(err, null); }
        else {
            var namesToDevices = {},
                deviceResponsePromise
            ;
            
            devices.forEach(function(device) { namesToDevices[device.name] = device});
            const requestedDevice = namesToDevices[deviceNameRequested];
	        console.log("requestedDevice", requestedDevice, namesToDevices);

            if (requestedDevice) {
                requestedDevice.alert();
                deviceResponsePromise = makeDeviceResponse(requestedDevice);
            } else {
                deviceResponsePromise = Promise.resolve('I can\'t find ' + deviceNameRequested + ' in ' + devices.map((device) => device.name).join(', '));
            }

            deviceResponsePromise.then(function(deviceResponse) {

                const response = {
                  version: '1.0',
                  response: {
                    outputSpeech: {
                      type: 'PlainText',
                      text: deviceResponse
                    },
                    shouldEndSession: true,
                  },
                };
              
                callback(null, response);
            })

        }
    });

    function makeDeviceResponse(requestedDevice) {

        var deviceLat = requestedDevice.location.latitude;
        var deviceLng = requestedDevice.location.longitude;

        var ext = config.address.split(' ').join('+');
        var url = "http://maps.google.com/maps/api/geocode/json?address=" + ext;
        console.log('Trying to get', url);
        return axios.get(url)
            .then(function(response) {
                    console.log('Got maps response', response);

                    if (response.data.status === 'ZERO_RESULTS') {
                        return 'I found the device, but Google Maps can not find ' + config.address;
                    } else {
                        var homeLat = response.data.results[0].geometry.location.lat
                        var homeLng = response.data.results[0].geometry.location.lng
                        console.log("Selected Device Location: ", deviceLat, deviceLng, " Home Location: ", homeLat, homeLng);
                        var distance = geo.getDistanceBetweenTwoCoordinates(deviceLat,deviceLng,homeLat,homeLng, {units:config.distanceUnits}).toFixed(1);
                        var distanceString = 'I\'m playing a sound on ' + deviceNameRequested + ', which is ' + distance + ' miles from here';
                        console.log('distanceString', distanceString);
                        return distanceString;
                    }
            });
    }

};

function getIcloud() {
    var icloud = require("find-my-iphone").findmyphone;
    icloud.apple_id = config.username;
    icloud.password = config.password;

    return {
        getDevices: getDevices,
        getFindableDevices: getFindableDevices
    };

    function getDevices(callback) { // must take (error, devices)
        icloud.getDevices(function(error, devices) {
            if (error) { callback(error, null); }
            else {
                devices.forEach(function(device) {
                    device.alert = function() {
                        icloud.alertDevice(device.id, function(err) {
                            if (err) { console.log('err', err); }
                            console.log('Beeping', device.name);
                        });
                    };
                });
                callback(null, devices);
            }
        });
    }

    function getFindableDevices(callback) {
        getDevices(function(error, devices) {
            if (error) { callback(error, null); }
            else {
                callback(null, devices.filter(function(d) { return d !== undefined && d.location && d.lostModeCapable; }));
            }
        });
    }
}


