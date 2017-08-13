const EventEmitter = require('eventemitter3');
const Lazy         = require('./Lazy');

const lazy = new Lazy(() => require('./ObjectEmitter'));

class KeyValueEmitter {

    constructor() {
        this._ee   = new EventEmitter();
        this._oe   = {};
        this.count = 0;
    }

    /**
     *
     * @param {string} key
     * @param {*} value
     */
    emit(key, value) {
        if (typeof value === 'object') {
            const oe = this._oe[key];
            return oe && oe.emit(value);
        }
        this._ee.emit(key, value);
    }

    /**
     *
     * @param {string} key
     * @param {*} value
     * @param {function()} cb
     */
    on(key, value, cb) {
        this.count++;
        if (typeof value === 'object') {
            const ObjectEmitter = lazy.get();
            const oe            = new ObjectEmitter();
            this._oe[key]       = oe.on(value, () => cb());
        } else {
            this._ee.on(key, v => (v == value) && cb());
        }
    }

}

module.exports = KeyValueEmitter;