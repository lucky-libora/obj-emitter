const KeyValueEmitter = require('./KeyValueEmitter');
const Listener        = require('./Listener');

class ObjectEmitter {

    constructor() {
        /**
         *
         * @type {Array.<Listener>}
         * @private
         */
        this._listeners = [];
    }

    /**
     *
     * @param {Object} obj
     * @returns {boolean}
     */
    emit(obj) {
        this._listeners.forEach(l => l.counter = 0);
        Object.entries(obj)
            .forEach(([key, value]) => {
                this._listeners.forEach(l => l.keyValueEmitter.emit(key, value));
            });
        const ls = this._listeners.filter(l => l.isSuitable());
        ls.forEach(l => l.cb(obj));
        return ls.length > 0;
    }

    /**
     *
     * @param {Object} obj
     * @param {function(Object)} cb
     * @returns {ObjectEmitter}
     */
    on(obj, cb) {
        const kvEmitter = new KeyValueEmitter();
        const listener  = new Listener(kvEmitter, cb);
        Object.entries(obj)
            .forEach(([key, value]) => {
                kvEmitter.on(key, value, () => listener.counter++);
            });
        this._listeners.push(listener);
        return this;
    }

    /**
     *
     * @param {Object} obj
     * @param {function(Object)} cb
     * @returns {ObjectEmitter}
     */
    once(obj, cb) {
        this.on(obj, cb);
        const removeCb = () => {
            this.removeListener(obj, cb)
                .removeListener(obj, removeCb);
        };
        return this.on(obj, removeCb);
    }

    /**
     *
     * @param {Object} obj
     * @param {function(Object)} cb
     * @returns {ObjectEmitter}
     */
    removeListener(obj, cb) {
        this._listeners = this._listeners.filter(l => l.cb !== cb || !l.keyValueEmitter.compareToObject(obj));
        return this;
    }

    /**
     *
     * @param {Object} obj
     * @returns {ObjectEmitter}
     */
    removeAllListeners(obj) {
        this._listeners = this._listeners.filter(l => !l.keyValueEmitter.compareToObject(obj));
        return this;
    }

}

module.exports = ObjectEmitter;