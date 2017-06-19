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
     */
    emit(obj) {
        this._matchers
            .filter(m => m.entries.every(e => e[1] === obj[e[0]]))
            .forEach(m => m.handler(obj));
    }

    /**
     *
     * @param {Object} obj
     * @param {function(Object)} handler
     */
    on(obj, handler) {
        this._matchers.push({entries: entries(obj), handler, obj});
    }

    /**
     *
     * @param {Object} obj
     * @param {function(Object)} handler
     */
    removeListener(obj, handler) {
        const keys     = Object.keys(obj);
        this._matchers = this._matchers.filter(m => {
            return handler !== m.handler
                || (m.entries.length !== keys.length)
                || m.entries.some(e => obj[e[0]] !== e[1]);
        });
    }

    /**
     *
     * @param {Object} obj
     */
    removeAllListeners(obj) {
        const keys     = Object.keys(obj);
        this._matchers = this._matchers.filter(m => {
            return (m.entries.length !== keys.length)
                || m.entries.some(e => obj[e[0]] !== e[1]);
        });
    }

}

module.exports = ObjEmitter;
