
/*
 * 元字符集：^ / - + \ [ ] ( ) * ? | 0-9 a-z A-Z
 * 1. 规则所有的字符要包含在//里面,多个规则用|隔开, 类似 /[a-Z]+|[0-9]/
 * 2. 空字符 \n \t ' '(空格) 
 *    换行符linux: \n, osx: \r, windows: \r\n;
 * 3. 只有+通配符，表示多个重复没有其他
 * 4. []表示一个集合，在[]中可以使用-号来简便表述，但是解析的时候会被扩展。
 * 5. ()内表示可选的内容，比如 abc(aaa|bbb)
 * 
 * 一条规则如下所示:
 *    NUMBER := /[0-9]+/
 *    STRING := /"[^]|*"/
 */

//var a = 'abc'
//var reg2dfa = function reg2dfa(stream){
//}
//

// NFA 描述：
// 状态的有有限集合 Q
// 输入符号的有限集合 S (Sigma)
// 转移函数 T
// 初始状态 q0
// 接受状态集合 F
// (E)Epsilon

// NFA 串联
// n3 = n1 -(E)-> n2
// Q3 = Q1 + Q2
// S3 = S1 + S2
// T3 = T1 + T2 + T( F -(E)-> q02 )
// q03 = q01
// F3 = F2 

// NFA 并联
// n3 = n1 | n2
// Q3 = Q1 + Q2 + q03
// S3 = S1 + S2
// T3 = T1 + T2 + T( q03 -(E)-> q01, q03 -(E)-> q02)
// q03 = (new start state)
// F3 = F2 + F1

// NFA 重复
// n3 = n1 *
// Q3 = Q1
// S3 = S1
// T3 = T1 + T( F3 -(E)-> q03)
// q03 = q01
// F3 = F1

define(['./Class'], function(Class){

  var NFA = Class('NFA', Object);

  NFA
  // classmethod
  .classmethod('createState', function(){
    var s = this.__state_count__ || 0;
    this.__state_count__ = s++;
    return s;
  })
  .classmethod('createTable', (function(){

    var p = function p(a){
      if (Array.isArray)
        return a;
      else if (typeof a === 'string')
        return [a];
      else
        throw 'Type Error!';
    };

    return function __createTable__(){
      var t = {};
      var inputs = p(inputs);
      var currents = p(currents);
      var nexts = p(nexts);

      inputs.forEach(function(input){
        t[input] = {};
        currents.forEach(function(current){
          t[input][current] = [];
          Array.prototype.push.apply(t[input][current], nexts);
        });
      });

      return t;
    };
  })())
  .classmethod('merge', (function(){
    
    var _copy = function(obj){
      return JSON.parse(JSON.strringify(obj));
    }

    var _merge = function _merge(target, obj){

      // merge Array
      if (isArray(obj) && isArray(target)){
        Array.prototype.push.apply(target, obj);
      }
      // merge object
      else if (typeof obj === typeof target === 'object'){
        for (var key in obj){

          // if is prototype, continue
          if (!obj.isPrototypeOf(key))
            continue;

          if (typeof obj[key] ===  typeof target[key] === 'object')
            merge(obj[key], target[key]);
          else
            target[key] = obj[key];

        }
        else 
          throw 'Merge Type Error!';
      }
    };

    return function merge(target, obj){
      return _merge(target, _copy(obj));
    };
  })())

  // method
  .method('constructor', function(Q, S, T, q0, F){
    this.Q = Q | [];
    this.S = S | [];
    this.T = T | {};
    this.q0 = q0 | NFA.createState();
    this.F = F | [];

    return this;
  })
  .method('series', function(nfa){

    NFA.merge(this.Q, nfa.Q);
    NFA.merge(this.S, nfa.S);

    NFA.merge(this.T, nfa.T);
    NFA.merge(this.T, NFA.createTable(
      'Epsilon',
      this.F,
      nfa.q0
    ));

    this.F = nfa.F;

    return this;
  })
  .method('parallel', function(nfa){

    var q03 = NFA.createState();

    NFA.merge(this.Q, nfa.Q);
    NFA.merge(this.Q, [q03]);

    NFA.merge(this.S, nfa.S);

    NFA.merge(this.T, nfa.T);
    NFA.merge(this.T, NFA.createTable(
      'Epsilon',
      [this.q0, nfa.q0],
      q03
    ));

    NFA.merge(this.F, nfa.F);

    this.q0 = q03;
  })
  .method('repeat', function(){

    NFA.merge(this.T, NFA.createTable(
      'Epsilon',
      this.F,
      [this.q0]
    ));

    return this;

  })
  .method('toDFA', function(){
  });

});

  //var Epsilon = null;

  //var merge = function merge(obj, target){

    //if (isArray(obj) && isArray(target)){
      //// merge array
      //Array.prototype.push.apply(target, obj);
    //}

    //else if (typeof obj === typeof target === 'object'){
      //for (var key in obj){

        //if (!obj.isPrototypeOf(key))
          //continue;

        //if (typeof obj[key] ===  typeof target[key] === 'object')
          //merge(obj[key], target[key]);
        //else
          //target[key] = obj[key];

    //}
    //else 
      //throw 'Merge Type Error!';
  //};
    
  //// 此处的是state table，而不是translate function。
  //var NFA = Class('NFA', Object)

    //.method('constructor', function(Q, S, T, q0, F){
      //this.Q = Q;
      //this.S = S;
      //this.T = T;
      //this.q0 = q0;
      //this.F = F;
    //})
    //.method('series', function(nfa){
      //merge(this.Q, nfa.Q);
      //merge(this.S, nfa.S);
      //merge(this.T, this.T);
      //this.F = nfa.F;
    //})
    //.method('parallel', function(nfa){
      //merge(this.Q, nfa.Q);
    //})
    //.method('repeat', function(){})
    //.method('toDFA', function(){});

