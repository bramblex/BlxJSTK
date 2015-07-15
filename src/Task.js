
define(['./EventEmitter'], function(EventEmitter){

  //============= BaseTask =========================
  var BaseTask = EventEmitter.extend('BaseTask');

  BaseTask.method('constructor', function(){
    BaseTask.uper('constructor').apply(this,arguments);
    this.status = 'stop';
  });

  BaseTask.method('start', function(){
    this.status = 'start';

    this.emit('end', data, 1);
    this.start = 'start';
  });

  //============= TaskUnit =========================
  var TaskUnit = BaseTask.extend('TaskUnit');

  TaskUnit.method('constructor', function(func){
    TaskUnit.uper('constructor').apply(this);
    this.func = func;
  });

  TaskUnit.method('start', function(data){
    if(this.status === START)
      throw 'Task is aready ran'
    this.status = START;

    var data = data;
    _this = this;

    setTimeout(function(){
      _this.emit('start', data);
      _this.func(data, function(_data, _step){
        var _data = _data;
        if (typeof _step !== 'number')
          var _step =  1;
        _this.emit('end', _data, _step);
        _this.status = STOP;
      });

    }, 0);
  });

  TaskUnit.method('fork', function(){
    return TaskUnit(this.func);
  });
  
  //============= TaskSequence =========================
  //
  var TaskSequence = BaseTask.extend('TaskSequence');

  TaskSequence.method('constructor', function(){
    TaskSequence.uper('constructor').apply(this);
    this.pc = 0;
    this.sequence = [];
  });

  var next = function next(_this, data, step){
    if (typeof step !== 'number')
      var step =  1;
    _next = arguments.callee;


    _this.pc = _this.pc + step;
    _this.emit('next', data, step);

    if (_this.pc < _this.sequeue_length){

      var current_task = _this.sequence[_this.pc];
      current_task.once('end', function(_data, _step){
        _next(_this, _data, _step);
      });
      current_task.start(data);

    }
    else{
        _this.pc = 0;
        _this.status = STOP;
        _this.emit('end', data, step);
    }

  };

  TaskSequence.method('start', function (data){
    if (this.status === START)
      throw 'Task is aready ran'
    this.status = START;
    this.sequeue_length = this.sequence.length;
    var _this = this;
    setTimeout(function(){
      _this.emit('start', data);
      next(_this, data, 0);
    }, 0)
  });

  TaskSequence.method('excute', function(task){
    this.sequence.push(Task(task));
    return this;
  });

  TaskSequence.method('branch', function(condition, task){
    this.excute(function(data, next){
      if (!!condition(data))
        next(data, 1);
      else
        next(data, 2);
    });
    this.excute(task);
  });

  TaskSequence.method('loop', function(condition, task){
    this.excute(task);
    this.excute(function(data, next){
      if (!!condition(data))
        next(data, -1);
      else
        next(data, 1);
    });
    return this;
  });

  TaskSequence.method('times', function(i, task){
    var i = i;
    this.excute(task);
    this.excute(function(data, next){
      if (i > 0){
        next(data, -1);
        i--;
      }
      else
        next(data, 1);
    });
    return this;
  });

  TaskSequence.method('fork' ,function(){
    var task_sequeue = TaskSequence();
    this.sequence.forEach(function(task){
      task_sequeue.excute(task.fork());
    });
    return task_sequeue;
  });
  
  //============= factory method ====================

  var Task = function Task(task){
    if (arguments.length === 0)
      return TaskSequence();
    else if(typeof task === 'function')
      return TaskUnit(task);
    else if(task instanceof BaseTask)
      return task.fork();
    else
      throw 'Arguments type error';
  };

  Task.BaseTask = BaseTask;
  Task.TaskUnit = TaskUnit;
  Task.TaskSequence = TaskSequence;

  return Task;
});
