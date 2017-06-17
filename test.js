const ObjEmitter = require('./lib/ObjEmitter');

const oe = new ObjEmitter();

for (var i = 0; i < 100; i++) {
    oe.on({a: random(), b: random(), c: random()}, obj => null);
}

const count = 1000000;

const start = new Date();

function random() {
    return Math.round(Math.random() * 10);
}

for (var i = 0; i < count; i++) {
    oe.emit({a: random(), b: random(), c: random()});
}

console.log(Math.round(count * 1000 / (new Date() - start)), 'rps');