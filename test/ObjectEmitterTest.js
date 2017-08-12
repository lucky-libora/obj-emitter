require('chai').should();
const ObjEmitter = require('../');

describe('ObjEmitter', () => {

    let oe;

    beforeEach(() => oe = new ObjEmitter());

    describe('#emit', () => {

        it('equal objects', cb => {
            oe.on({a: 1, b: 2}, obj => {
                obj.should.deep.equal({a: 1, b: 2});
                cb();
            });
            oe.emit({a: 1, b: 2});
        });

        it('emit object with additional fields', cb => {
            oe.on({a: 1, b: 2}, obj => {
                obj.should.deep.equal({a: 1, b: 2, c: 3});
                cb();
            });
            oe.emit({a: 1, b: 2, c: 3});
        });

        it('not equal values', cb => {
            oe.on({a: 1, b: 2}, obj => cb(new Error('Should not call callback')));
            oe.emit({a: 2, b: 1});
            cb();
        });

        it('not enough fields', cb => {
            oe.on({a: 1, b: 2}, obj => cb(new Error('Should not call callback')));
            oe.emit({a: 1});
            cb();
        });

        it('on empty object', cb => {
            oe.on({}, obj => {
                obj.should.deep.equal({a: 1, b: 2});
                cb();
            });
            oe.emit({a: 1, b: 2});
        });

    });

    describe('#once', () => {

        it('basic test', () => {
            let counter = 0;
            oe.once({a: 1}, () => counter++);
            oe.emit({a: 1});
            oe.emit({a: 1});
            counter.should.equal(1);
        });

        it('equal objects', cb => {
            oe.once({a: 1, b: 2}, obj => {
                obj.should.deep.equal({a: 1, b: 2});
                cb();
            });
            oe.emit({a: 1, b: 2});
        });

        it('emit object with additional fields', cb => {
            oe.once({a: 1, b: 2}, obj => {
                obj.should.deep.equal({a: 1, b: 2, c: 3});
                cb();
            });
            oe.emit({a: 1, b: 2, c: 3});
        });

        it('not equal values', cb => {
            oe.once({a: 1, b: 2}, obj => cb(new Error('Should not call callback')));
            oe.emit({a: 2, b: 1});
            cb();
        });

        it('not enough fields', cb => {
            oe.once({a: 1, b: 2}, obj => cb(new Error('Should not call callback')));
            oe.emit({a: 1});
            cb();
        });

        it('on empty object', cb => {
            oe.once({}, obj => {
                obj.should.deep.equal({a: 1, b: 2});
                cb();
            });
            oe.emit({a: 1, b: 2});
        });

    });

    describe('#removeListener', () => {

        it('basic test', cb => {
            const fn = obj => cb(new Error('Should not call callback'));
            oe.on({a: 1, b: 2}, fn);
            oe.removeListener({a: 1, b: 2}, fn);
            oe.emit({a: 1, b: 2});
            cb();
        });

        it('different objects', cb => {
            const fn = obj => cb();
            oe.on({a: 1, b: 2}, fn);
            oe.removeListener({a: 2, b: 3}, fn);
            oe.emit({a: 1, b: 2});
        });

        it('different handlers', cb => {
            oe.on({a: 1, b: 2}, obj => cb());
            oe.removeListener({a: 2, b: 3}, obj => cb());
            oe.emit({a: 1, b: 2});
        });

        it('check remove all handlers', cb => {
            const fn = obj => cb(new Error('Should not call callback'));
            oe.on({a: 1, b: 2}, fn);
            oe.on({a: 1, b: 2}, fn);
            oe.on({a: 1, b: 2}, fn);
            oe.removeListener({a: 1, b: 2}, fn);
            oe.emit({a: 1, b: 2});
            cb()
        });

    });

    describe('#removeAllListeners', () => {

        it('basic test', cb => {
            oe.on({a: 1, b: 2}, () => cb(new Error('Should not call callback')));
            oe.on({a: 1, b: 2}, () => cb(new Error('Should not call callback')));
            oe.removeAllListeners({a: 1, b: 2});
            oe.emit({a: 1, b: 2});
            cb();
        });

    });

});
