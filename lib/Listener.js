const KeyValueEmitter = require('./KeyValueEmitter');
const utils           = require('./utils');

class Listener {

  /**
   *
   * @param {Object} obj
   * @param {function(Object)} cb
   */
  constructor(obj, cb) {
    this._kvEmitter = new KeyValueEmitter();
    this.cb         = cb;
    this.counter    = 0;
    this._obj       = obj;
    this.keySet     = new Set();
    utils.entries(obj)
      .forEach(([key, value]) => {
        this._kvEmitter.on(key, value, () => this.counter++);
        this.keySet.add(key);
      });
  }

  clearState() {
    this.counter = 0;
  }

  /**
   *
   * @param {string} key
   * @param {*} value
   */
  emit(key, value) {
    if (!this._kvEmitter.error) {
      this._kvEmitter.emit(key, value);
    }
  }

  /**
   *
   * @param {Object} obj
   * @param {function(Object)} cb
   * @returns {boolean}
   */
  equal(obj, cb) {
    return this.cb === cb && utils.objEqual(this._obj, obj);
  }

  /**
   *
   * @param {Object} obj
   * @returns {boolean}
   */
  equalToObject(obj) {
    return utils.objEqual(this._obj, obj);
  }

  /**
   *
   * @returns {boolean}
   */
  isSuitable() {
    return this.counter === this._kvEmitter.count;
  }

}

module.exports = Listener;
