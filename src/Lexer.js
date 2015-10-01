
define(['./Class'], function(Class){

  var each = function each(list, func){
    var l = list.length;
    var reslut;
    for (var i = 0; i<l; i++){
      reslut = func(list[i]);
      if (!!reslut)
        return reslut;
    };
    return false;
  };

  var Lexer = Class('Lexer', Object)
  .method('constructor', function constructor(){
    this.__parser__ = [];
  })
  .method('parse', function parse(stream){

    var i;
    var l = stream.length;

    var tokens = [];

    // 开始
    for (i=0; i<l; i++){
      var t = each(this.__parser__, function(parser){
        return parser(stream, i, l);
      });
      if(!t){
        throw 'Parse Error!';
      }
      else{
        i = t.offset-1;
        if (t.token){
          tokens.push(t.token);
        }
      }
    }

    // 返回解析结果
    return tokens;
  })
  .method('addParser', function addParser(parser){
    this.__parser__.push(parser);
    return this;
  });

  var utils = {};
  utils.createToken = function createToken(type, content){
    return {type: type, content: content};
  };
  utils.isD = function isDigit(c){
    var code = c.charCodeAt(0);
    return (code >= 48 && code <= 57);
  };
  utils.isA = function isAlpha(c){
    var code = c.charCodeAt(0);
    return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
  };

  var generalparser = {};
  generalparser.identifier = function identifierParser (stream, i, l){

    if (!utils.isA(stream[i]) && stream[i] !== '_'){
      return false;
    }

    for (var j=i; j<l; j++){
      if (!(utils.isA(stream[j]) || utils.isD(stream[j]) || stream[j] === '_')){
        break;
      }
    };

    return {
      offset: j,
      token: utils.createToken('identifier', stream.slice(i, j))
    };
  };

  generalparser.symbol = function symbolParser(stream, i, l){
    var operator_list = '`~!@$%^&*()-+=[]{}\\|:;<>,./?';
    if (operator_list.indexOf(stream[i]) >= 0){
      return {
        offset: i+1,
        token: utils.createToken('symbol', stream[i])
      }
    }
    else{
      return false;
    }
  };

  generalparser.literal = function literalParser(stream, i, l){
  };

  generalparser.space = function spaceParser(stream, i, l){

    if (stream[i] === ' '){
      var count = 0;
      for (var j=i; j<l; j++){
        if (stream[j] === ' '){
          count = count + 1;
        }
        else {
          break;
        }
      }
      return {
        offset: j,
        token: utils.createToken('space', count)
      }
    }
    else{
      return false;
    }

  };

  generalparser.comment = function commentParser(stream, i, l){
    if (stream[i] !== '#'){
      return false;
    }
    else {
      for (var j=i; j<l; j++){
        if (stream[j] === '\n'){
          return {
            offset: j,
            token: null,
          }
        }
      }
    }
  };

  generalparser.EOL = function EOLParser(stream, i, l){
    if (stream[i] === '\n'){
      return {
        offset: i+1,
        token: utils.createToken('EOL'),
      }
    }
    else {
      return false;
    }
  }

  Lexer.utils = utils;
  Lexer.generalparser = generalparser;
  return Lexer;

});
