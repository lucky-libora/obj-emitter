const polyfill = require('./polyfill');

const entries = polyfill.entries;

class ObjEmitter {

    constructor() {
        /**
         *
         * @type {Array.<{entries:Array.<Array>, handler: function(Object), obj: Object}>}
         * @private
         */
        this._matchers = [];
    }

    /**
     *
     * @param {Object} obj
     * @returns {boolean}
     */
    emit(obj) {
        const matchers = this._matchers.filter(m => m.entries.every(e => e[1] === obj[e[0]]));
        matchers.forEach(m => m.handler(obj));
        return matchers.length > 0;
    }

    /**
     *
     * @param {Object} obj
     * @param {function(Object)} handler
     * @returns {ObjEmitter}
     */
    on(obj, handler) {
        this._matchers.push({entries: entries(obj), handler, obj});
        return this;
    }

    /**
     *
     * @param {Object} obj
     * @param {function(Object)} handler
     * @returns {ObjEmitter}
     */
    removeListener(obj, handler) {
        const keys     = Object.keys(obj);
        this._matchers = this._matchers.filter(m => {
            return handler !== m.handler
                || (m.entries.length !== keys.length)
                || m.entries.some(e => obj[e[0]] !== e[1]);
        });
        return this;
    }

    /**
     *
     * @param {Object} obj
     * @returns {ObjEmitter}
     */
    removeAllListeners(obj) {
        const keys     = Object.keys(obj);
        this._matchers = this._matchers.filter(m => {
            return (m.entries.length !== keys.length)
                || m.entries.some(e => obj[e[0]] !== e[1]);
        });
        return this;
    }

}

module.exports = ObjEmitter;
