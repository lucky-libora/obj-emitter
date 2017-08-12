class KeyValue {

    /**
     *
     * @param {string} key
     * @param {*} value
     */
    constructor(key, value) {
        this.key   = key;
        this.value = value;
    }

    /**
     *
     * @param {Object} obj
     * @returns {Array.<KeyValue>}
     */
    static fromObject(obj) {
        return Object.entries(obj)
            .map(([key, value]) => new KeyValue(key, value));
    }

}

module.exports = KeyValue;