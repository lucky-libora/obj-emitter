const chai     = require('chai');
const polyfill = require('../lib/polyfill');

chai.should();

describe('Polyfill', () => {

    describe('Method entries', () => {

        it('basic test', () => {
            polyfill.entries({a: 1, b: 2}).should.deep.equal([['a', 1], ['b', 2]])
        });

        it('empty object', () => {
            polyfill.entries({}).should.deep.equal([]);
        });

        it('null argument', () => {
            chai.expect(() => polyfill.entries(null)).to.throw('Cannot convert undefined or null to object')
        });

    });

});
