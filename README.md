# Promise polyfill for node.js

**Don't use this**: [this one](https://github.com/taylorhakes/promise-polyfill) by someone else is better.

A polyfill for ES6 Promise object for Node v0.10.

Node version 0.11 and above uses a version of V8 with the native Promise object and will not require this.

All about promises:

* http://www.html5rocks.com/en/tutorials/es6/promises/
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

# Usage

```javascript
// In anticipation of native support in future Node versions
if ( typeof Promise === 'undefined' ) {
	var Promise = require('promise-polyfill');
}
```

The polyfill will `console.warn()` if the native Promise object (or another polyfill added as a global) already exists.

# Use in a browser

If you really wanted to use this in a browser you'd need to polyfill 
`setImmediate` and ensure `Object.defineProperty` is supported, or polyfilled. 

For old browsers, `catch` is an ES3 reserved word.  This means you would need to ensure `catch` is quoted where ever it is used, and update the libary so this is true.  See http://kangax.github.io/compat-table/es5/#Reserved_words_as_property_names for affected browsers.  Probably best to stick to `then` if this is a concern.