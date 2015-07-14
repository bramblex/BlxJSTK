
(function(__root__, __define__){
  var define = function define(dependencies, factory) {

    var factory = factory || dependencies;
    var dependencies = (Array.isArray(dependencies) && dependencies) || [];

    if ( typeof __define__ === 'function' && __define__.amd){
      __define__(dependencies, factory);
    } else if ( typeof __define__ === 'function' && __define__.cmd){
      __define__(dependencies, function(require, exports, module){
        module.exports = factory.apply(__root__, dependencies.map(function(m){
          return require(m);
        }));
      });
    } else if (typeof exports === 'object'){
      module.exports = factory.apply(__root__, dependencies.map(function(m){
        return require(m);
      }));
    } else{
      var name = document.currentScript.src.replace(/(^.*?)([^\/]+)\.(js)(\?.*$|$)/, '$2');
      name = name.replace('.min', '');
      __root__[name] = factory.apply(__root__, dependencies.map(function(m){
        return __root__[m.replace(/^.*\//, '')];
      }));
    }
  };

  
define(['./EventEmitter', './Class'], function(){
  //var FSM = EventEmitter.extend('FSM');

  //FSM.method('constructor', function(){

    //this.state = null;
    //this.__rules__ = {};
    //this.rules = [];
  //});

  //// current_state ( input ) => next_state
  //var re = /^\s*([\w\*]+)\s*\(\s*(\w+)\s*\)\s*=>\s*(\w+)\s*$/;
  //var re_start = /\*/;

  //var blocked = function blocked(){
    //throw 'Error: Function blocked';
  //};

  //var parse = function parse(rule){
    //var parsed = rule.match(re);
    //var sign = (function(){
      //if (re_start.test(parsed[1]))
        //return 'regex';
      //return 'normal';
    //})();
    //return {
      //sign: sign,
      //input: parsed[2],
      //current_state: parsed[1],
      //next_state: parsed[3],
    //};
  //};

  //var select = function select(list, reg_str){
    //var r = RegExp('^'+reg_str.replace('*', '\\w+')+'$');
    //var tmp = [];
    //list.forEach(function(item){
      //if(r.test(item))
        //tmp.push(item);
    //});
    //return tmp;
  //};

  //var complie = function complie(_this){
    //var rules_list = [];
    //var state_list = [];

    //_this.rules.forEach(function(rule){
      //var parsed = parse(rule);
      //var sign = parsed.sign;
      //var current_state = parsed.current_state;
      //var next_state = parsed.next_state;

      //if (sign === 'normal' && (state_list.indexOf(current_state) < 0))
        //state_list.push(current_state);

      //if (state_list.indexOf(next_state) < 0)
        //state_list.push(next_state);

      //rules_list.push(parsed);
    //});

    //rules_list.forEach(function(rule){
      //var sign = rule.sign;
      //var input = rule.input;
      //var current_state = rule.current_state;
      //var next_state = rule.next_state;

      //if (typeof _this.__rules__[input] !== typeof {})
        //_this.__rules__[input] = {};

      //if (sign === 'regex'){
        //select(state_list, current_state).forEach(function(current_state){
          //_this.__rules__[input][current_state] = next_state;
        //});
      //}
      //else if (sign === 'normal'){
        //_this.__rules__[input][current_state] = next_state;
      //}

      ////delete(_this.rules);
    //});
  //};

  //FSM.prototype.rule = function rule(r){

    //if(re.test(r)){
      //this.rules.push(r);
      //return this;
    //}

    //throw 'Error: ' + r;
  //};

  //FSM.prototype.input = function input(input){

    //if (!this.state)
      //throw 'Error: ' + input;
    
    //if (!!this.__rules__[input] && !!this.__rules__[input][this.state]){
      //var current_state = this.state;
      //var next_state = this.__rules__[input][this.state];
      
      //this.emit('change', current_state, next_state, input);
      //this.emit(this.state+'end', input);
      //this.emit(this.state+'to'+next_state, input);
      //this.state = next_state;
      //this.emit(next_state+'enter', input);
      //return this;
    //}

    //throw 'Error: ' + input;
  //};

  //FSM.prototype.start = function start(s){
    //this.state = s;
    //this.rule = blocked;
    //this.start = blocked;
    //complie(this);
  //}

  //var start = function start(s){
    //this.state = s;
    //this.start = blocked;
  //};

  //FSM.prototype.clone = function clone(s){
    //var obj = this.__class__();
    //obj.rule = blocked;
    //obj.rules = this.rules;
    //obj.__rules__ = this.__rules__;
    //obj.start = start;

    //return obj;
  //};

  //window.FSM = FSM;

  //window.car = FSM();
});



})(this, typeof define !== 'undefined' && define);
