/**
 *
 * @type {function(Object):Array.<Array>}
 */
exports.entries = Object.entries || (obj => Object.keys(obj).map(key => [key, obj[key]]));