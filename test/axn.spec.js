/*jshint node: true */
/*global describe, it */
var expect = require('expect.js');
var axn = require('../');

describe('axn', function() {
  it('remembers listeners', function() {
    var listener = function() {};
    var action = axn();
    action.listen(listener);
    expect(action._listeners.length).to.equal(1);
  });
  it('notifies listeners when data is emitted', function() {
    var action = axn();
    var messages = [];
    var listener = function(data) {
      messages.push(data);
    };
    var message = 'hello world';
    action.listen(listener);
    action(message);
    expect(messages).to.only.contain(message);
  });
  it('binds listeners to the given context', function (done) {
    var ctx = {hello: 'world'};
    var action = axn();
    var listener = function() {
      expect(this).to.equal(ctx);
      done();
    };
    action.listen(listener, ctx);
    action();
  });
  it('notifies each listener in sequence', function() {
    var action = axn();
    var results = [];
    action.listen(function() {
      results.push('one');
    });
    action.listen(function() {
      results.push('two');
    });
    action.listen(function() {
      results.push('three');
    });
    action('message');
    expect(results).to.eql(['one', 'two', 'three']);
  });
  it('emits each message in sequence', function() {
    var action = axn();
    var messages = [];
    var listener = function(msg) {
      messages.push(msg);
    };
    action.listen(listener);
    action('one');
    action('two');
    action('three');
    expect(messages).to.eql(['one', 'two', 'three']);
  });
  describe('when notified without listeners', function() {
    it('does not throw an error', function() {
      var action = axn();
      action('hello');
    });
  });
  describe('when a listener is unlistened', function() {
    var action, result, callback1, callback2;
    var listener1 = function() {
      listener1.timesCalled += 1;
    };
    var listener2 = function() {
      listener2.timesCalled += 1;
    };
    beforeEach(function() {
      action = axn();
      listener1.timesCalled = 0;
      listener2.timesCalled = 0;
      var unlisten = action.listen(listener1);
      callback1 = action._listeners[action._listeners.length - 1];
      action.listen(listener2);
      callback2 = action._listeners[action._listeners.length - 1];
      result = unlisten();
    });
    it('returns true', function() {
      expect(result).to.equal(true);
    });
    it('does not unlisten other functions', function() {
      expect(action._listeners).to.only.contain(callback2);
    });
    it('does not notify unlistened listeners', function() {
      action('message');
      expect(listener1.timesCalled).to.equal(0);
    });
    it('does notify other listeners', function() {
      action('message');
      expect(listener2.timesCalled).to.equal(1);
    });
  });
  describe('when an unlistened listener is unlistened again', function() {
    it('returns false', function() {
      var action = axn();
      var listener = function() {};
      var nonListener = function() {};
      var result;
      action.listen(listener);
      var callback = action._listeners[action._listeners.length - 1];
      var unlisten = action.listen(nonListener);
      unlisten();
      result = unlisten();
      expect(result).to.equal(false);
      expect(action._listeners).to.only.contain(callback);
    });
  });
  describe('when a spec is provided', function () {
    it('is extended with the spec', function () {
      var spec = {example: 'hi'};
      var action = axn(spec);
      expect(action.example).to.equal(spec.example);
    });
    it('overrides built-ins', function () {
      expect(axn.methods).to.have.property('beforeEmit');
      var spec = {beforeEmit: function () {}};
      var action = axn(spec);
      expect(action.beforeEmit).to.equal(spec.beforeEmit);
      expect(action.beforeEmit).not.to.equal(axn.methods.beforeEmit);
    });
    describe('when shouldEmit is overridden', function () {
      it('only emits if shouldEmit returns true', function () {
        var action = axn({
          shouldEmit: function () {
            return false;
          }
        });
        action.listen(function () {
          expect().fail();
        });
        action();
      });
      it('passes the pre-processed data to shouldEmit', function (done) {
        var value = 'potato';
        var action = axn({
          beforeEmit: function () {
            return value;
          },
          shouldEmit: function (input) {
            expect(input).to.equal(value);
            done();
          }
        });
        action('hi');
      });
    });
    describe('when beforeEmit is overridden', function () {
      it('passes its value to beforeEmit', function (done) {
        var value = {yo: 'sup'};
        var action = axn({
          beforeEmit: function (input) {
            expect(input).to.equal(value);
            done();
          }
        });
        action(value);
      });
      it('emits the result of beforeEmit', function (done) {
        var value = 'tomato';
        var action = axn({
          beforeEmit: function () {
            return value;
          }
        });
        action.listen(function (input) {
          expect(input).to.equal(value);
          done();
        });
        action('nope');
      });
    });
  });
});
