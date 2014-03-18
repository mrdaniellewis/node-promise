/**
 *	Tests for Promise polyfill
 */

var style = require('styleconsole'); 

var test = require('./test.js');
var emitter = test( function(result) {
		if ( result ) {
			console.log('SUCCESS: All tests complete');
		} else {
			console.log('FAILURE: Test returned an error');
		}

	} )
	.on( 'fail', function(name,e ) {
		console.log( style.redBG.white( 'FAIL: ' + name ) );

		if ( e.stack ) {
			console.log( style.red(e) );
			console.log( e.stack );
		} else {
			console.log( style.red(e) );
		}

	} )
	.on( 'pass', function(name) {
		console.log( style.green( 'PASS: ' + name ) );
	} );

