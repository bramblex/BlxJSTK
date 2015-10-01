
//var r = require('./dist/RequireAll');
//console.log(r('./dist'));
//var R  = require('./dist/Router');

//var r = R();

var Lexer = require('./dist/Lexer'); 

var lexer = Lexer();

lexer
  .addParser(Lexer.generalparser.symbol)
  .addParser(Lexer.generalparser.identifier)
  .addParser(Lexer.generalparser.space)
  .addParser(Lexer.generalparser.EOL)

console.log(lexer.__parser__);
console.log(lexer.parse('aaa + bbbb ++ ccc \n'));

