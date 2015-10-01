
// nodejs / iojs only.
define(function(){

  var path = require('path');
  var fs = require('fs');
  var isjs = /\.js$/

  return function ReuqireAll(dir, callback){
    var result = {};
    var files = fs.readdirSync(dir);
    //var callback = callback
    var callback = callback || function(m){return require(m)}

    files
    .filter(function(item){
      return isjs.test(item);
    })
    .map(function(item){
      return item.replace(isjs, '');
    })
    .forEach(function(item, index, self){
      var name = path.basename(item);
      var module_path = path.resolve((path.join(dir, item)));

      //result[name] = require(module_path);
      result[name] = callback(module_path);
    });

    return result;
  }

});
