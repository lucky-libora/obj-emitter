const EventEmitter = require('eventemitter3');

class KeyValueEmitter {

    constructor() {
        this._ee        = new EventEmitter();
        this._keyValues = {};
        this.count      = 0;
    }

    /**
     *
     * @param {Object} obj
     * @returns {boolean}
     */
    compareToObject(obj) {
        const entries = Object.entries(obj);
        return (this.count === entries.length) && Object.entries(this._keyValues)
            .every(([key, value]) => obj[key] == value);
    }

    /**
     *
     * @param {string} key
     * @param {*} value
     */
    emit(key, value) {
        this._ee.emit(key, value);
    }

    /**
     *
     * @param {string} key
     * @param {*} value
     * @param {function()} cb
     */
    on(key, value, cb) {
        this._ee.on(key, v => {
            if (v == value) {
                cb();
            }
        });
        this.count++;
        this._keyValues[key] = value;
    }

}

module.exports = KeyValueEmitter;