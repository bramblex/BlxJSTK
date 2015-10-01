
define(function(){

  var named = function named(name, func){
    var code = func.toString();
    return '(' + code.replace(/(function\s+)(\w*?)\s*(\([\w, ]*?\))/m, '$1'+name+'$3') + ')';
  };

  var method = function method(name, func){
    var this_class = this;

    if (name === 'constructor')
      name = '__constructor__';

    if(!this_class.prototype[name] || this_class.prototype[name]['__class__'] !== this_class){
      this_class.prototype[name] = eval(named(this_class.name+'_'+name, function(){
        var methods = this_class['__methods__'];
        var method = (methods && ( methods[name][arguments.length] || methods[name][0] ) ) || undefined;
        if (!method)
          throw 'method not found!';
        return method.apply(this, arguments);
      }));
      this_class.prototype[name]['__class__'] = this_class;
    }

    if(!this_class.__methods__)
      this_class.__methods__ = {};
    if(!this_class.__methods__[name])
      this_class.__methods__[name] = {};
    this_class.__methods__[name][func.length] = func; 

    return this;
  }

  var classmethod = function method(name, func){
    this[name] = named(name, func);
    return this;
  }

  var extend = function extend(name){
    return Class(name, this);
  };

  var alias = function alias(name, method){
    this.prototype[name] = this.prototype[method];
    return this;
  };

  var uper = function uper(name){
    var this_class = this;
    if (name === 'constructor')
      name = '__constructor__';
    return this_class.parent.prototype[name];
  };

  var Class = function Class(name, parent){

    var child = eval(named(name, function(){
      var this_class = arguments.callee;
      var obj;
      if(this instanceof this_class){
        if (!!this_class.__sign__){
          delete this_class.__sign__;
          return;
        } else {
          obj = this;
        }
      }
      else{
        this_class.__sign__ = true;
        obj = new this_class();
      }
      obj.__class__ = this_class;
      this_class.prototype['__constructor__'].apply(obj, arguments);

      return obj;
    }));

    if (!!parent['parent'])
      parent.__sign__ = true;
    child.prototype = new parent();
    child.parent = parent;

    // function
    child.method = method;
    child.extend = extend;
    child.alias = alias;
    child.uper = uper;
    child.name = name;

    child.method('constructor', function(){
      if (child.uper('constructor'))
        child.uper('constructor').apply(this, arguments);
    });

    // init
    return child;
  };

  return Class;
});
