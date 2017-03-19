const relationships = {
    'mom':      'mom',
    'moms':     'mom',
    'claire':   'mom',
    'claires':	'mom',

    'dad':      'dad',
    'dads':     'dad',

    'mine':     'son',
    'my':       'son',
    'skyler':   'son',
    'skylers':  'son'
};

const deviceTypes = {
    'phone':    'phone',
    'phones':   'phone',
    'iphone':   'phone',
    'iphones':	'phone',

    'ipad':     'tablet',
    'ipads':    'tablet',
    'pad':      'tablet',
    'pads':     'tablet'
};

const deviceMap = {
    'momphone':     'iPhone',
    'momtablet':    'Claire\'s iPad',
    'dadphone':     'Doug\'s iPhone 7 Plus',
    'dadtablet':    null,
    'sonphone':     'Skyler Spaeth\'s iPhone 7 Plus',
    'sontablet':    'Skyler Spaeth\'s iPad'
};

module.exports.findDevice = function(relationship, deviceType) {
    const canonicalRelationship = relationships[relationship.toLowerCase().replace("'", "")];
    const canonicalDeviceType = deviceTypes[deviceType.toLowerCase().replace("'", "")];
    const deviceKey = canonicalRelationship + canonicalDeviceType;
    return deviceMap[deviceKey];
};
