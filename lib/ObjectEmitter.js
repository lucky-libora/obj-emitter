const EventEmitter = require('event-emitter3');
const Listener     = require('./Listener');
const utils        = require('./utils');

const nullSymbol      = Symbol('null');
const undefinedSymbol = Symbol('undefined');

class ObjectEmitter {

  constructor() {
    this._ee        = new EventEmitter();
    this._listeners = [];
    this._keySet    = new Set();
    this._kvEmitter = new EventEmitter();
    this._oe        = {};
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
        this._keySet.forEach(key => {
          const value = obj[key];
          if (typeof value !== 'object') {
            return this._kvEmitter.emit(key, value);
          }
          const oe = this._oe[key];
          return oe && oe.emit(value);
        });
        return this._listeners.filter(l => {
          const res = l.counter === l.count;
          if (res) {
            l.cb(obj);
          }
          return res;
        });
      },
      () => this._ee.emit(obj.toString(), obj),
      () => this._ee.emit(nullSymbol, null),
      () => this._ee.emit(undefinedSymbol, undefined)
    );
  }

  /**
   *
   * @param {string} key
   * @returns {ObjectEmitter}
   */
  _getOrCreateOE(key) {
    let oe = this._oe[key];
    if (!oe) {
      oe            = new ObjectEmitter();
      this._oe[key] = oe;
    }
    return oe;
  }

  /**
   *
   * @param {*} obj
   * @param {function(*)} cb
   * @returns {ObjectEmitter}
   */
  off(obj, cb) {
    return this.removeListener(obj, cb);
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
      () => {
        const entries  = utils.entries(obj);
        const listener = new Listener(obj, cb, entries.length);
        entries.forEach(([key, value]) => {
          this._keySet.add(key);
          listener.keySet.add(key);
          if (typeof value !== 'object') {
            const fn = v => value == v && listener.counter++;
            this._kvEmitter.on(key, fn);
            return listener.map.set(key, fn);
          }
          const oe = this._getOrCreateOE(key);
          const fn = () => listener.counter++;
          oe.on(value, fn);
          listener.oeMap.set(key, {value, fn})
        });
        this._listeners.push(listener);
      },
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
      () => {
        const listenersCount = this._listeners.length;
        this._listeners      = this._listeners.filter(l => {
          const res = l.cb === cb && utils.objEqual(l.obj, obj);
          if (res) {
            l.map.forEach((fn, key) => this._kvEmitter.removeListener(key, fn));
            l.oeMap.forEach(({value, fn}, key) => this._getOrCreateOE(key).removeListener(value, fn));
          }
          return !res;
        });
        if (this._listeners.length !== listenersCount) {
          this._updateKeySet();
        }
      },
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
      () => {
        const listenersCount = this._listeners.length;
        this._listeners      = this._listeners.filter(l => {
          const res = utils.objEqual(l.obj, obj);
          if (res) {
            l.map.forEach((fn, key) => this._kvEmitter.removeListener(key, fn));
            l.oeMap.forEach(({value, fn}, key) => this._getOrCreateOE(key).removeListener(value, fn));
          }
          return !res;
        });
        if (this._listeners.length !== listenersCount) {
          this._updateKeySet();
        }
      },
      () => this._ee.removeAllListeners(obj.toString()),
      () => this._ee.removeAllListeners(nullSymbol),
      () => this._ee.removeAllListeners(undefinedSymbol)
    );
    return this;
  }

  /**
   *
   * @private
   */
  _updateKeySet() {
    this._keySet = new Set();
    this._listeners.forEach(l => {
      l.keySet.forEach(k => this._keySet.add(k));
    });
  }

}

ObjectEmitter.ObjectEmitter = ObjectEmitter;

module.exports = ObjectEmitter;