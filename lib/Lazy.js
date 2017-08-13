class Lazy {

    /**
     *
     * @param {function()} fn
     */
    constructor(fn) {
        this._fn           = fn;
        this._isCalculated = false;
        /**
         *
         * @type {*}
         * @private
         */
        this._value = null;
    }

    /**
     *
     * @returns {*}
     */
    get() {
        if (!this._isCalculated) {
            this._value = this._fn();
            this._isCalculated = true;
        }
        return this._value;
    }

}

module.exports = Lazy;
