class Listener {

  /**
   *
   * @param {Object} obj
   * @param {function(Object)} cb
   * @param {number} count
   */
  constructor(obj, cb, count) {
    this.cb      = cb;
    this.obj     = obj;
    this.counter = 0;
    this.count   = count;
    /**
     *
     * @type {Set.<string>}
     */
    this.keySet  = new Set();
    /**
     *
     * @type {Map.<string, function>}
     */
    this.map     = new Map();
    /**
     *
     * @type {Map.<string, {oe: ObjectEmitter, fn: function}>}
     */
    this.oeMap   = new Map();
  }

}

module.exports = Listener;