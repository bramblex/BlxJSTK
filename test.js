
var Animal = Class('Animal', Object);

Animal.method('constructor', function(){
  this.type = 'animal'
  console.log('Animal constructor');
});

Animal.method('fuck', function(){
});

var Cat =  Animal.extend('Cat');

Cat.method('constructor', function(name){
  this.name = name;
  console.log('Cat constructor')
});

Cat.method('miao', function(){
  console.log('miao');
});

var kitty = Cat('kitty');
