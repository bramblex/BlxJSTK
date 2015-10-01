
var A = Class('A', Object);

A.method('constructor', function(){
  console.log('A');
});

var B = A.extend('B');
B.method('constructor', function(){
  B.uper('constructor').apply(this, arguments);
  console.log('B');
});


var C = B.extend('C');
C.method('constructor', function(){
  C.uper('constructor').apply(this, arguments);
  console.log('C');
});

C.method('test', function(){console.log('this is C')});

var a = C();
