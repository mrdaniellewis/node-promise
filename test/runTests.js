/**
 *	Tests for Promise polyfill
 */

var test = require('./test.js');
test( function(result) {
	if ( result ) {
		console.log('SUCCESS: All tests complete');
	} else {
		console.log('FAILURE: Test returned an error');
	}

} );