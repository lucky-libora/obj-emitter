const Listener = require('./Listener');

class ListenerList {

  constructor() {
    /**
     *
     * @type {Array.<Listener>}
     * @private
     */
    this._listeners = [];
    this._keySet = new Set();
  }

  /**
   *
   * @param {Object} obj
   * @param {function(Object)} cb
   */
  add(obj, cb) {
    const listener = new Listener(obj, cb);
    this._listeners.push(listener);
    listener.keySet.forEach(key => this._keySet.add(key));
  }

  /**
   *
   * @returns {ListenerList}
   */
  clearCounters() {
    this._listeners.forEach(l => l.counter = 0);
    return this;
  }

  /**
   *
   * @param {string} key
   * @param {*} value
   */
  emit(key, value) {
    this._listeners.forEach(l => l.emit(key, value));
  }

  /**
   *
   * @returns {Set}
   */
  keys() {
    return this._keySet;
  }

  /**
   *
   * @param {Object} obj
   * @param {function(Object)} cb
   */
  removeListener(obj, cb) {
    this._listeners = this._listeners.filter(l => !l.equal(obj, cb));
    this._updateKeySet();
  }

  /**
   *
   * @param {Object} obj
   */
  removeAllListeners(obj) {
    this._listeners = this._listeners.filter(l => !l.equalToObject(obj));
    this._updateKeySet();
  }

  /**
   *
   * @param {Object} obj
   * @returns {boolean}
   */
  runForSuitable(obj) {
    const ls = this._listeners.filter(l => l.isSuitable());
    ls.forEach(l => l.cb(obj));
    return ls.length > 0;
  }

  /**
   *
   * @private
   */
  _updateKeySet() {
    this._listeners.forEach(l => {
      l.keySet.forEach(key => this._keySet.add(key));
    });
  }

}

module.exports = ListenerList;
