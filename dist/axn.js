/*jshint es3: true */
/*global module */
'use strict';
function axn(spec) {
  function action(data) {
    action.emit(data);
  }
  action._listeners = [];
  var key;
  if (spec) {
    for (key in spec) {
      if (!spec.hasOwnProperty(key)) continue;
      if (action.hasOwnProperty(key)) continue;
      action[key] = spec[key];
    }
  }
  for (key in axn.methods) {
    if (!axn.methods.hasOwnProperty(key)) continue;
    if (action.hasOwnProperty(key)) continue;
    action[key] = axn.methods[key];
  }
  return action;
}

axn.methods = {
  listen: function (fn, ctx) {
    function cb(data) {
      return fn.call(ctx, data);
    }
    this._listeners.push(cb);
    cb.ctx = ctx;
    cb.fn = fn;
    var self = this;
    return function () {
      var i = self._listeners.indexOf(cb);
      if (i === -1) return false;
      self._listeners.splice(i, 1);
      return true;
    };
  },
  listenOnce: function (fn, ctx) {
    function callThenUnlisten(data) {
      fn(data);
      unlisten();
    }
    var unlisten = this.listen(callThenUnlisten, ctx);
  },
  unlisten: function (fn, ctx) {
    for (var i = 0; i < this._listeners.length; i++) {
      var listener = this._listeners[i];
      if (listener.fn === fn && listener.ctx === ctx) {
        this._listeners.splice(i, 1);
        return true;
      }
    }
    return false;
  },
  shouldEmit: function (/* data */) {
    return true;
  },
  beforeEmit: function (data) {
    return data;
  },
  emit: function (data) {
    data = this.beforeEmit(data);
    if (!this.shouldEmit(data)) return;
    for (var i = 0; i < this._listeners.length; i++) {
      this._listeners[i].call(undefined, data);
    }
  }
};

module.exports = axn;
