const EventEmitter = require('event-emitter3');
const ListenerList = require('./ListenerList');
const utils        = require('./utils');

const nullSymbol      = Symbol('null');
const undefinedSymbol = Symbol('undefined');

class ObjectEmitter {

  constructor() {
    this._ee = new EventEmitter();
    this._listeners = new ListenerList();
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
        this._listeners
          .clearCounters()
          .keys()
          .forEach(key => this._listeners.emit(key, obj[key]));
        return this._listeners.runForSuitable(obj);
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
      () => this._listeners.add(obj, cb),
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
      () => this._listeners.removeListener(obj, cb),
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
      () => this._listeners.removeAllListeners(obj),
      () => this._ee.removeAllListeners(obj.toString()),
      () => this._ee.removeAllListeners(nullSymbol),
      () => this._ee.removeAllListeners(undefinedSymbol)
    );
    return this;
  }

}

module.exports = ObjectEmitter;