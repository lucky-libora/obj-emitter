class Listener {

    /**
     *
     * @param {KeyValueEmitter} keyValueEmitter
     * @param {function(Object)} cb
     */
    constructor(keyValueEmitter, cb) {
        this.keyValueEmitter = keyValueEmitter;
        this.cb              = cb;
        this.counter         = 0;
    }

    isSuitable() {
        return this.counter === this.keyValueEmitter.count;
    }

}

module.exports = Listener;
