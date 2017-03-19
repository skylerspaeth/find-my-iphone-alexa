'use strict';

const getDeviceByName = require('./device-config').findDevice;

module.exports.findMyIphone = (event, context, callback) => {

    const relationship = event.request.intent.slots.relationship.value;
    const deviceType = event.request.intent.slots.device.value;
    const deviceNameRequested = getDeviceByName(relationship, deviceType);
    console.log('Device Logic', {relationship:relationship, deviceType:deviceType, deviceNameRequested:deviceNameRequested});

	getIcloud().getFindableDevices(function(err, devices) {
		if (err) { callback(err, null); }
		else {
            var namesToDevices = {},
                deviceResponse
            ;
            devices.forEach(function(device) { namesToDevices[device.name] = device});
            const requestedDevice = namesToDevices[deviceNameRequested];

            if (requestedDevice) {
                deviceResponse = 'I\'m playing a sound on ' + deviceNameRequested;
                requestedDevice.alert();
            } else {
			    deviceResponse = 'I can\'t find ' + deviceNameRequested + ' in ' + devices.map((device) => device.name).join(', ');
            }

            const response = {
              version: '1.0',
              response: {
                outputSpeech: {
                  type: 'PlainText',
                  //text: `Your lucky number is ${number}`,
                  text: deviceResponse
                },
                shouldEndSession: true,
              },
            };
          
            callback(null, response);
		}
	});

};

function getIcloud() {
    var 
        icloud = require("find-my-iphone").findmyphone,
        credentials = require('./credentials')
    ;
    icloud.apple_id = credentials.username;
    icloud.password = credentials.password;

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

//getIcloud().getFindableDevices(function(err, devices) {
	//console.log(devices);
//});
