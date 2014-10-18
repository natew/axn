/*jshint es3: true */
/*global module */
module.exports = axn;
function axn(spec) {
  'use strict';
  function action(data) {
    action.emit(data);
  }
  action._listeners = [];
  var key;
  if (spec) {
    for (key in spec) {
      if (action.hasOwnProperty(key)) continue;
      action[key] = spec[key];
    }
  }
  for (key in axn.methods) {
    if (action.hasOwnProperty(key)) continue;
    action[key] = axn.methods[key];
  }
  return action;
}
axn.methods = {
  listen: function (fn, ctx) {
    'use strict';
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
  unlisten: function (fn, ctx) {
    'use strict';
    for (var i = 0; i < this._listeners.length; i++) {
      var listener = this._listeners[i];
      if (listener.fn === fn && listener.ctx === ctx) {
        this._listeners.splice(i, 1);
        return true;
      }
    }
    return false;
  },
  beforeEmit: function (data) {
    'use strict';
    return data;
  },
  emit: function (data) {
    'use strict';
    data = this.beforeEmit(data);
    for (var i = 0; i < this._listeners.length; i++) {
      this._listeners[i].call(undefined, data);
    }
  }
};
