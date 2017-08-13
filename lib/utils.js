/**
 *
 * @param {*} obj
 * @param {function()} objectFn
 * @param {function()} primitiveFn
 * @param {function()} nullFn
 * @param {function()} undefinedFn
 * @returns {*}
 */
function ifObject(obj, objectFn, primitiveFn, nullFn, undefinedFn) {
    if (obj === null) {
        return nullFn();
    } else if (obj === undefined) {
        return undefinedFn();
    } else if (typeof obj === 'object') {
        return objectFn();
    }
    return primitiveFn();
}

/**
 *
 * @param {Object} o1
 * @param {Object} o2
 * @returns {boolean}
 */
function objEqual(o1, o2) {
    return Object.entries(o1)
        .every(([key, value]) => {
            if (typeof value === 'object') {
                const temp = o2[key];
                return typeof temp === 'object' && objEqual(value, temp);
            }
            return value == o2[key];
        });
}

exports.ifObject = ifObject;
exports.objEqual = objEqual;
