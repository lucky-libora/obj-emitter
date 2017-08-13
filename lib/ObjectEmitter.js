const EventEmitter = require('event-emitter3');
const Listener     = require('./Listener');
const utils        = require('./utils');

const nullSymbol = Symbol('null');
const undefinedSymbol = Symbol('undefined');

class ObjectEmitter {

    constructor() {
        this._ee = new EventEmitter();
        /**
         *
         * @type {Array.<Listener>}
         * @private
         */
        this._listeners = [];
    }

    /**
     *
     * @param {*} obj
     * @returns {boolean}
     */
    emit(obj) {
        return utils.ifObject(
            obj,
            () => {
                this._listeners.forEach(l => l.counter = 0);
                Object.entries(obj)
                    .forEach(([key, value]) => {
                        this._listeners.forEach(l => l.emit(key, value));
                    });
                const ls = this._listeners.filter(l => l.isSuitable());
                ls.forEach(l => l.cb(obj));
                return ls.length > 0;
            },
            () => this._ee.emit(obj.toString(), obj),
            () => this._ee.emit(nullSymbol, null),
            () => this._ee.emit(undefinedSymbol, undefined)
        );
    }

    /**
     *
     * @param {*} obj
     * @param {function(Object)} cb
     * @returns {ObjectEmitter}
     */
    on(obj, cb) {
        utils.ifObject(
            obj,
            () => this._listeners.push(new Listener(obj, cb)),
            () => this._ee.on(obj.toString(), cb),
            () => this._ee.on(nullSymbol, cb),
            () => this._ee.on(undefinedSymbol, cb)
        );
        return this;
    }

    /**
     *
     * @param {*} obj
     * @param {function(Object)} cb
     * @returns {ObjectEmitter}
     */
    once(obj, cb) {
        utils.ifObject(
            obj,
            () => {
                this.on(obj, cb);
                const removeCb = () => {
                    this.removeListener(obj, cb)
                        .removeListener(obj, removeCb);
                };
                this.on(obj, removeCb);
            },
            () => this._ee.once(obj.toString(), cb),
            () => this._ee.once(nullSymbol, cb),
            () => this._ee.once(undefinedSymbol, cb)
        );
        return this;
    }

    /**
     *
     * @param {*} obj
     * @param {function(Object)} cb
     * @returns {ObjectEmitter}
     */
    removeListener(obj, cb) {
        utils.ifObject(
            obj,
            () => this._listeners = this._listeners.filter(l => !l.equal(obj, cb)),
            () => this._ee.removeListener(obj.toString(), cb),
            () => this._ee.removeListener(nullSymbol, cb),
            () => this._ee.removeListener(undefinedSymbol, cb)
        );
        return this;
    }

    /**
     *
     * @param {Object} obj
     * @returns {ObjectEmitter}
     */
    removeAllListeners(obj) {
        utils.ifObject(
            obj,
            () => this._listeners = this._listeners.filter(l => !l.equalToObject(obj)),
            () => this._ee.removeAllListeners(obj.toString()),
            () => this._ee.removeAllListeners(nullSymbol),
            () => this._ee.removeAllListeners(undefinedSymbol)
        );
        return this;
    }

}

module.exports = ObjectEmitter;