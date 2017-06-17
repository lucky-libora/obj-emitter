# obj-emitter
Simple event emitter which use object instead of strings

# Example

const objEmitter = new ObjEmitter();
objEmitter.on({a:1, b:2}, obj => console.log('Emits', obj));

obj.emit({a:1, b:2});       //call handler
obj.emit({a:1, b:2, c:3});  //call handler
obj.emit({a:2, b:5});       //do not call handler

