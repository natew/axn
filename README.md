# Synopsis

**axn** is a small (< 1 kB minified, ~500 bytes gzipped) implementation of listenable actions or signals in JavaScript.

[![license - MIT](http://b.repl.ca/v1/license-MIT-blue.png)](http://pluma.mit-license.org) [![Flattr this](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=pluma&url=https://github.com/pluma/axn)

[![browser support](https://ci.testling.com/pluma/axn.png)](https://ci.testling.com/pluma/axn)

[![Build Status](https://travis-ci.org/pluma/axn.png?branch=master)](https://travis-ci.org/pluma/axn) [![Coverage Status](https://coveralls.io/repos/pluma/axn/badge.png?branch=master)](https://coveralls.io/r/pluma/axn?branch=master) [![Dependencies](https://david-dm.org/pluma/axn.png?theme=shields.io)](https://david-dm.org/pluma/axn)

[![NPM status](https://nodei.co/npm/axn.png?compact=true)](https://npmjs.org/package/axn)

# Install

## Node.js

### With NPM

```sh
npm install axn
```

### From source

```sh
git clone https://github.com/pluma/axn.git
cd axn
npm install
npm run test && npm run dist
```

## Browser

### With component

```sh
component install pluma/axn
```

[Learn more about component](https://github.com/component/component).

### With bower

```sh
bower install axn
```

[Learn more about bower](https://github.com/twitter/bower).

### With a CommonJS module loader

Download the [latest minified CommonJS release](https://raw.github.com/pluma/axn/master/dist/axn.min.js) and add it to your project.

[Learn more about CommonJS modules](http://wiki.commonjs.org/wiki/Modules/1.1).

### With an AMD module loader

Download the [latest minified AMD release](https://raw.github.com/pluma/axn/master/dist/axn.amd.min.js) and add it to your project.

[Learn more about AMD modules](http://requirejs.org/docs/whyamd.html).

### As a standalone library

Download the [latest minified standalone release](https://raw.github.com/pluma/axn/master/dist/axn.globals.min.js) and add it to your project.

```html
<script src="/your/js/path/axn.globals.min.js"></script>
```

This makes the `axn` module available in the global namespace.

# API

## axn([spec]):Function

Creates a new action.

If `spec` is an object, its properties will be copied to the new action, overwriting its default properties.

## axn::(data)

Invokes the action's listeners with the given `data`.

## axn::listen(fn, [ctx]):Function

Adds a given function to the action's listeners. If `ctx` is provided, the function will be invoked using it as its `this` context.

Returns a function that will remove the listener from the action.

## axn::unlisten(fn, [ctx]):Boolean

Removes the given function with the given context from the action's listeners.

Returns `true` if the listener was removed successfully, otherwise returns `false`.

## axn::beforeEmit(data):data

Override this function in your action's `spec` to pre-process data passed to the action before it is emitted.

The return value will be passed to the action's listeners.

## axn.methods

An object containing the default properties that will be copied to new actions.

# License

The MIT/Expat license. For more information, see http://pluma.mit-license.org/ or the accompanying [LICENSE](https://github.com/pluma/axn/blob/master/LICENSE) file.