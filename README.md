# obj-emitter
Emit anything you want. If object is suitable then object will be handled by callback.
Optionally you can use this way to emit booleans, strings, numbers, symbols, arrays  

# Example


```
const objEmitter = new ObjEmitter();
objEmitter.on({a:1, b:2}, obj => console.log('Emits', obj));

objEmitter.emit({a:1, b:2});       //Emits {a:1, b:2}
objEmitter.emit({a:1, b:2, c:3});  //Emits {a:1, b:2, c:3}
objEmitter.emit({a:2, b:5});       //do not call handler

const cb = o => console.log(o);
objEmitter.on({x: 1, y: {z: 'test'}, cb);
objEmitter.removeListener({x: 1, y: {z: 'test'}, cb);  //removing listener

objEmitter.removeAllListeners({a:1, b:2}); //remove all listeners of this object pattern

```