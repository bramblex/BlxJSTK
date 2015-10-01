
//var r = require('./dist/RequireAll');
//console.log(r('./dist'));
//var R  = require('./dist/Router');

//var r = R();

var Lexer = require('./dist/Lexer'); 

var lexer = Lexer();

lexer
  .addParser(Lexer.generalparser.identifier)
  .addParser(Lexer.generalparser.symbol)
  .addParser(Lexer.generalparser.space)
  .addParser(Lexer.generalparser.number)
  .addParser(Lexer.generalparser.string)
  .addParser(Lexer.generalparser.EOL)
  .addParser(Lexer.generalparser.comment);

//console.log(lexer.__parser__);
//console.log(lexer.parse('aaa + bbbb ++ ccc 123.123 \n "this is a string" \n'));
//console.log(lexer.parse('asdf sdf asdf#'));


var fs = require('fs');
var code = fs.readFileSync('/tmp/test.py','utf-8');
console.log(code);
console.log(lexer.parse(code));

