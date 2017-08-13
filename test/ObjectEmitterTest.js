const chai          = require('chai');
const ObjectEmitter = require('../index');

chai.should();

describe('ObjEmitter', () => {

    let oe;

    beforeEach(() => oe = new ObjectEmitter());

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

        it('inner object', cb => {
            oe.on({a: 1, b: {c: 1}}, obj => {
                obj.should.deep.equal({a: 1, b: {c: 1, d: 2}});
                cb();
            });
            oe.emit({a: 1, b: {c: 1, d: 2}});
        });

        it('not valid inner object', cb => {
            oe.on({a: 1, b: {c: 1}}, obj => cb(new Error()));
            oe.emit({a: 1, b: {d: 2}});
            cb();
        });

        it('array check', cb => {
            oe.on([1, 2, 3], obj => {
                obj.should.deep.equal([1, 2, 3, 4]);
                cb();
            });
            oe.emit([1, 2, 3, 4]);
        });

        it('not valid array check', cb => {
            oe.on([1, 2, 3], obj => cb(new Error()));
            oe.emit([1, 2, 4]);
            cb();
        });

        it('string check', cb => {
            oe.on('test', obj => {
                obj.should.equal('test');
                cb();
            });
            oe.emit('test');
        });

        it('not valid string check', cb => {
            oe.on('test', () => cb(new Error()));
            oe.emit('test123');
            cb();
        });

        it('number check', cb => {
            oe.on(123, o => {
                o.should.equal(123);
                cb();
            });
            oe.emit(123);
        });

        it('not valid number check', cb => {
            oe.on(123, o => cb(new Error()));
            oe.emit(1234);
            cb();
        });

        it('boolean check', cb => {
            oe.on(true, o => {
                o.should.equal(true);
                cb();
            });
            oe.emit(true);
        });

        it('not valid boolean', cb => {
            oe.on(true, () => cb(new Error()));
            oe.emit(false);
            cb();
        });

        it('undefined', cb => {
            oe.on(undefined, o => {
                chai.expect(o).to.equal(undefined);
                cb();
            });
            oe.emit(undefined);
        });

        it('null', cb => {
            oe.on(null, o => {
                chai.expect(o).to.equal(null);
                cb();
            });
            oe.emit(null);
        });

    });

    describe('#once', () => {

        it('equal objects', () => {
            let count = 0;
            oe.once({a: 1, b: 2}, obj => {
                obj.should.deep.equal({a: 1, b: 2});
                count++;
            });
            oe.emit({a: 1, b: 2});
            oe.emit({a: 1, b: 2});
            count.should.equal(1);
        });

        it('emit object with additional fields', () => {
            let count = 0;
            oe.once({a: 1, b: 2}, obj => {
                obj.should.deep.equal({a: 1, b: 2, c: 3});
                count++;
            });
            oe.emit({a: 1, b: 2, c: 3});
            oe.emit({a: 1, b: 2, c: 3});
            count.should.equal(1);
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

        it('on empty object', () => {
            let count = 0;
            oe.once({}, obj => {
                obj.should.deep.equal({a: 1, b: 2});
                count++;
            });
            oe.emit({a: 1, b: 2});
            oe.emit({a: 1, b: 2});
            count.should.equal(1);
        });

        it('inner object', () => {
            let count = 0;
            oe.once({a: 1, b: {c: 1}}, obj => {
                obj.should.deep.equal({a: 1, b: {c: 1, d: 2}});
                count++;
            });
            oe.emit({a: 1, b: {c: 1, d: 2}});
            oe.emit({a: 1, b: {c: 1, d: 2}});
            count.should.equal(1);
        });

        it('not valid inner object', cb => {
            oe.once({a: 1, b: {c: 1}}, obj => cb(new Error()));
            oe.emit({a: 1, b: {d: 2}});
            cb();
        });

        it('array check', () => {
            let count = 0;
            oe.once([1, 2, 3], obj => {
                obj.should.deep.equal([1, 2, 3, 4]);
                count++;
            });
            oe.emit([1, 2, 3, 4]);
            oe.emit([1, 2, 3, 4]);
            count.should.equal(1);
        });

        it('not valid array check', cb => {
            oe.once([1, 2, 3], obj => cb(new Error()));
            oe.emit([1, 2, 4]);
            cb();
        });

        it('string check', () => {
            let count = 0;
            oe.once('test', obj => {
                obj.should.equal('test');
                count++;
            });
            oe.emit('test');
            oe.emit('test');
            count.should.equal(1);
        });

        it('not valid string check', cb => {
            oe.once('test', () => cb(new Error()));
            oe.emit('test123');
            cb();
        });

        it('number check', () => {
            let count = 0;
            oe.once(123, o => {
                o.should.equal(123);
                count++;
            });
            oe.emit(123);
            oe.emit(123);
            count.should.equal(1);
        });

        it('not valid number check', cb => {
            oe.once(123, o => cb(new Error()));
            oe.emit(1234);
            cb();
        });

        it('boolean check', () => {
            let count = 0;
            oe.once(true, o => {
                o.should.equal(true);
                count++;
            });
            oe.emit(true);
            oe.emit(true);
            count.should.equal(1);
        });

        it('not valid boolean', cb => {
            oe.once(true, () => cb(new Error()));
            oe.emit(false);
            cb();
        });

        it('undefined', () => {
            let count = 0;
            oe.once(undefined, o => {
                chai.expect(o).to.equal(undefined);
                count++;
            });
            oe.emit(undefined);
            oe.emit(undefined);
            count.should.equal(1);
        });

        it('null', () => {
            let count = 0;
            oe.once(null, o => {
                chai.expect(o).to.equal(null);
                count++;
            });
            oe.emit(null);
            oe.emit(null);
            count.should.equal(1);
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

        it('inner objects', cb => {
            const fn = obj => cb(new Error('Should not call callback'));
            oe.on({a: 1, b: 2, c: {d: 1, e: 2}}, fn);
            oe.removeListener({a: 1, b: 2, c: {d: 1, e: 2}}, fn);
            oe.emit({a: 1, b: 2, c: {d: 1, e: 2}, z: {}});
            cb();
        });

        it('primitive', cb => {
            const fn = () => cb(new Error());
            oe.on('test', fn);
            oe.removeListener('test', fn);
            cb();
        });


        it('undefined', cb => {
            const fn = () => cb(new Error());
            oe.on(undefined, fn);
            oe.removeListener(undefined, fn);
            cb();
        });

        it('null', cb => {
            const fn = () => cb(new Error());
            oe.on(null, fn);
            oe.removeListener(null, fn);
            cb();
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

        it('primitive', cb => {
            oe.on('test', () => cb(new Error('Should not call callback')));
            oe.on('test', () => cb(new Error('Should not call callback')));
            oe.removeAllListeners('test');
            oe.emit('test');
            cb();

        });

        it('null', cb => {
            oe.on(null, () => cb(new Error('Should not call callback')));
            oe.on(null, () => cb(new Error('Should not call callback')));
            oe.removeAllListeners(null);
            oe.emit(null);
            cb();

        });

        it('undefined', cb => {
            oe.on(undefined, () => cb(new Error('Should not call callback')));
            oe.on(undefined, () => cb(new Error('Should not call callback')));
            oe.removeAllListeners(undefined);
            oe.emit(undefined);
            cb();

        });

    });

});
