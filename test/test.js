/**
 *	Promise tests
 */

var assert = require('assert');
var EventEmitter = require('events').EventEmitter;

var Promise = require('promise');

module.exports = function test(cb) {

	var tests = {
		
		'Simple resolve': function(cb) {

			var progress = 'start';

			new Promise( function(resolve,reject) {	
					progress = 'initiate';
					resolve('a');
				} )
				.then( 
					function(value) {
						try {
							assert.equal( progress, 'end' );
							assert.equal( value, 'a' );
						} catch (e) {
							cb(e);
							return;
						}
						cb();
					},
					function() {
						cb( new Error('Reject handler called') );
					}
				);
			
			assert.equal( progress, 'initiate' );

			progress = 'end';


		},

		'Simple reject': function(cb) {

			new Promise( function(resolve,reject) {	
					reject('a');
				} )
				.then( 
					function() {
						cb( new Error('Resolve handler called') );
					},
					function(value) {
						try {
							assert.equal( value, 'a' );
						} catch (e) {
							cb(e);
							return;
						}
						cb();
				} );

		},

		'Can only resolve once': function(cb) {

			new Promise( function(resolve,reject) {	
					resolve('a');
					resolve('b');
					reject('c');
				} )
				.then( 
					function(value) {
						try {
							assert.equal( value, 'a' );
						} catch (e) {
							cb(e);
							return;
						}
						cb();
					},
					function() {
						cb( new Error('Reject handler called') );
					} 
				);

		},

		'Can only reject once': function(cb) {

			new Promise( function(resolve,reject) {	
					reject('a');
					resolve('b');
					reject('c');
				} )
				.then( 
					function() {
						cb( new Error('Resolve handler called') );
					},
					function(value) {
						try {
							assert.equal( value, 'a' );
						} catch (e) {
							cb(e);
							return;
						}
						cb();
				} );

		},

		'Thrown error': function(cb) {

			new Promise( function(resolve,reject) {	
					throw 'a';
				} )
				.then( 
					function() {
						cb( new Error('Resolve handler called') );
					},
					function(value) {
						try {
							assert.equal( value, 'a' );
						} catch (e) {
							cb(e);
							return;
						}
						cb();
				} );

		},

		'Catch': function(cb) {

			new Promise( function(resolve,reject) {	
					reject('a');
				} )
				.catch( 
					function(value) {
						try {
							assert.equal( value, 'a' );
						} catch (e) {
							cb(e);
							return;
						}
						cb();
				} );

		},

		'Chained resolution': function(cb) {

			new Promise( function(resolve,reject) {	
					resolve('a');
				} )
				.then( 
					function(value) {
						try {
							assert.equal( value, 'a' );
						} catch (e) {
							cb(e);
							return;
						}
						return 'b';
					},
					function() {
						cb( new Error('Reject handler called') );
					}
				)
				.then( 
					function(value) {
						try {
							assert.equal( value, 'b' );
						} catch (e) {
							cb(e);
							return;
						}
						cb();
					},
					function() {
						cb( new Error('Reject handler called') );
					}
				);

		},

		'Chained rejection': function(cb) {

			new Promise( function(resolve,reject) {	
					reject('a');
				} )
				.then( 
					function() {
						cb( new Error('Resolve handler called') );
					},
					function(value) {
						try {
							assert.equal( value, 'a' );
						} catch (e) {
							cb(e);
							return;
						}
						return 'b';
					}	
				)
				.then( 
					function(value) {
						try {
							assert.equal( value, 'b' );
						} catch (e) {
							cb(e);
							return;
						}
						cb();
					},
					function() {
						cb( new Error('Reject handler called') );
					}
				);

		},

		'Chained undefined resolve handlers': function(cb) {

			new Promise( function(resolve,reject) {
					resolve('a');    
				} )
				.then()
				.then(null)
				.then({})
				.then(undefined)
				.then(NaN)
				.then(Promise.resolve('b'))
				.catch( function() {
					return 'c';
				} )
				.then( 
					function(value) {
						try {
							assert.equal( value, 'a' );
						} catch (e) {
							cb(e);
							return;
						}
						cb();
					},
					function() {
						cb( new Error('Reject handler called') );
					}
				);
		},


		'Chained undefined reject handlers': function(cb) {
			new Promise( function(resolve,reject) {
					reject('a');
				} )
				.then()
				.catch(null)
				.catch({})
				.catch(undefined)
				.catch(NaN)
				.catch(Promise.resolve('b'))
				.then( function() {
					return 'c';
				} )
				.then( 
					function() {
						cb( new Error('Resolve handler called') );
					},
					function(value) {
						try {
							assert.equal( value, 'a' );
						} catch (e) {
							cb(e);
							return;
						}
						cb();
					}
				);
		},

		'Returned promises are followed in then resolutions': function(cb) {

			new Promise( function(resolve,reject) {
					resolve('a');
				} )
				.then( function(value) {
					return new Promise( function(resolve,reject) {
							resolve('b');
						} )
						.then( function(value) {
							return 'c';
						} )
						.then( function(value) {
							return 'd';
						} );
				} )
				.then(
					function(value) {
						try {
							assert.equal( value, 'd' );
						} catch (e) {
							cb(e);
							return;
						}
						cb();
					},
					function() {
						cb( new Error('Reject handler called') );
					}
				);
		},

		'Returned promises are followed in then rejections': function(cb) {

			new Promise( function(resolve,reject) {
					reject('a');
				} )
				.catch( function(value) {
					return new Promise( function(resolve,reject) {
							resolve('b');
						} )
						.then( function(value) {
							return 'c';
						} )
						.then( function(value) {
							return 'd';
						} );
				} )
				.then(
					function(value) {
						try {
							assert.equal( value, 'd' );
						} catch (e) {
							cb(e);
							return;
						}
						cb();
					},
					function() {
						cb( new Error('Reject handler called') );
					}
				);
		},

		'Promises resolved with promises are followed': function(cb) {

			new Promise( function(resolve,reject) {
					resolve( 
						new Promise( function(resolve,reject) {
							resolve('a');
						} )
						.then( function(value) {
							return 'b';
						} )
						.then( function(value) {
							return 'c';
						} )
					);
				} )
				.then(
					function(value) {
						try {
							assert.equal( value, 'c' );
						} catch (e) {
							cb(e);
							return;
						}
						cb();
					},
					function() {
						cb( new Error('Reject handler called') );
					}
				);
		},

		'Promises resolved with rejects are not followed': function(cb) {

			new Promise( function(resolve,reject) {
					reject( 
						new Promise( function(resolve,reject) {
							resolve('a');
						} )
						.then( function(value) {
							return 'b';
						} )
						.then( function(value) {
							return 'c';
						} )
					);
				} )
				.then(
					function(value) {
						cb( new Error('Resolve handler called') );
					},
					function(value) {
						try {
							assert.equal( value.constructor, Promise );
						} catch (e) {
							cb(e);
							return;
						}
						cb();
					}
				);
		},

		'Multiple handlers': function(cb) {

			var resolveProxy;
			var promise = new Promise( function(resolve,reject) {
				resolveProxy = resolve;
			} );
			var progress = 0;

			promise
				.then( function(value) {
					assert.equal( value, 'a' );
					return 'b';
				} )
				.catch( function(e) {
					cb( e || new Error( 'reject handler 1 called') );
				} )
				.then( function(value) {
					assert.equal( progress, 1 );
					assert.equal( value, 'b' );
					progress = 2;
				} )
				.catch( function(e) {
					cb( e || new Error( 'reject handler 2 called') );
				} );

			promise
				.then( function(value) {
					assert.equal( value, 'a' );
					return 'c';
				} )
				.catch( function(e) {
					cb( e || new Error( 'reject handler 3 called') );
				} )
				.then( function(value) {
					assert.equal( progress, 2 );
					assert.equal( value, 'c' );
					cb();
				} )
				.catch( function(e) {
					cb( e || new Error( 'reject handler 4 called') );
				} );

			assert.equal( progress, 0 );
			progress = 1;


			resolveProxy('a');


		},

		'Promise.resolve(value)': function(cb) {

			Promise.resolve('a')
				.then( function(value) {
					assert.equal( value, 'a' );
					cb();
				} )
				.catch( function(e) {
					cb( e || new Error( 'reject handler called') );
				} );


		},

		'Promise.resolve({thenable})': function(cb) {

			var resolveProxy;

			var thenable = {
				then: function(resolve,reject) {
					resolveProxy = resolve;
				}
			};

			Promise.resolve(thenable)
				.then( function(value) {
					assert.equal( value, 'a' );
					cb();
				} )
				.catch( function(e) {
					cb( e || new Error( 'reject handler called') );
				} );

			resolveProxy('a');
		
		},

		'Promise.resolve({thenable}) - rejection': function(cb) {

			var rejectProxy;

			var thenable = {
				then: function(resolve,reject) {
					rejectProxy = reject;
				}
			};

			Promise.resolve(thenable)
				.then( function(value) {
					cb( new Error( 'resolve handler called') );
				} )
				.catch( function(value) {
					assert.equal( value, 'a' );
					cb();
				} )
				.catch( function(e) {
					cb( e || new Error( 'reject handler called') );
				} );


			rejectProxy('a');
		
		},

		'Promise.reject(value)': function(cb) {

			Promise.reject('a')
				.then( function(value) {
					cb( new Error( 'resolve handler called') );
				} )
				.catch( function(value) {
					assert.equal( value, 'a' );
					cb();
				} )
				.catch( function(e) {
					cb( e || new Error( 'reject handler called') );
				} );
		
		},

		'Returned thenables are followed in then resolutions': function(cb) {

			// Immediatly resolving thenable
			var thenable = {
				then: function(resolve) {
					resolve('b');
				}
			};
			
			new Promise( function(resolve,reject) {
					resolve('a');
				} )
				.then( function(value) {
					return thenable;
				} )
				.then(
					function(value) {
						assert.equal( value, 'b' );
						cb();
					}
				)
				.catch( function(e) {
					cb( e || new Error( 'reject handler called') );
				} );

		},

		'Returned thenables are followed in then rejections': function(cb) {

			// Immediatly rejecting thenable
			var thenable = {
				then: function(resolve,reject) {
					reject('b');
				}
			};
			
			new Promise( function(resolve,reject) {
					resolve('a');
				} )
				.then( function(value) {
					return thenable;
				} )
				.catch( function(value) {
					assert.equal( value, 'b' );
					cb();
				} )
				.catch( function(e) {
					cb( e || new Error( 'reject handler called') );
				} );

		},

		'Promises resolved with thenables are followed': function(cb) {

			// Immediatly resolving thenable
			var thenable = {
				then: function(resolve) {
					resolve('b');
				}
			};
			
			new Promise( function(resolve,reject) {
					resolve(thenable);
				} )
				.then(
					function(value) {
						assert.equal( value, 'b' );
						cb();
					}
				)
				.catch( function(e) {
					cb( e || new Error( 'reject handler called') );
				} );

		},

		'Promises rejected with thenables are not followed': function(cb) {

			// Immediatly rejecting thenable
			var thenable = {
				then: function(resolve,reject) {
					reject('b');
				}
			};
			
			new Promise( function(resolve,reject) {
					reject(thenable);
				} )
				.catch( function(value) {
					assert.equal( value, thenable );
					cb();
				} )
				.catch( function(e) {
					cb( e || new Error( 'reject handler called') );
				} );

		},

		'Promise.all resolved': function(cb) {

			var ob = {};

			Promise.all( [
					'string',
					ob,
					{
						then: function(resolve) {
							resolve('a');
						}
					},
					Promise.resolve(ob),
					Promise.resolve(5),
					undefined,
					null
				] )
				.then( function(value) {

					assert.deepEqual( value, [
						'string',
						ob,
						'a',
						ob,
						5,
						undefined,
						null
					]);

					cb();

				} )
				.catch( function(e) {
					cb( e || new Error( 'reject handler called') );
				} );
		},

		'Promise.all rejected': function(cb) {

			var ob = {};

			Promise.all( [
					'string',
					ob,
					{
						then: function(resolve,reject) {
							reject('a');
						}
					},
					Promise.resolve(ob),
					Promise.resolve(5),
					Promise.reject('b'),
					undefined,
					null
				] )
				.catch( function(value) {
					assert.equal( value, 'a' );
					cb();
				} )
				.catch( function(e) {
					cb( e || new Error( 'reject handler called') );
				} );
		},

		'Promise.all sequence': function(cb) {

			var ob = {};

			Promise.all( {
					0: Promise.resolve(ob),
					1: Promise.resolve(5),
					length: 2
				} )
				.then( function(value) {

					assert.deepEqual( value, [
						ob,
						5
					]);

					cb();

				} )
				.catch( function(e) {
					cb( e || new Error( 'reject handler called') );
				} );
		},

		'Promise.race resolved': function(cb) {

			var ob = {};

			Promise.race( [
					'string',
					ob,
					{
						then: function(resolve) {
							resolve('a');
						}
					},
					Promise.resolve(ob),
					Promise.resolve(5),
					undefined,
					null
				] )
				.then( function(value) {

					assert.equal( value, 'string' );
					cb();

				} )
				.catch( function(e) {
					cb( e || new Error( 'reject handler called') );
				} );
		},

		'Promise.race rejected': function(cb) {

			var ob = {};

			Promise.all( [
					Promise.reject('b'),
					ob,
					{
						then: function(resolve,reject) {
							reject('a');
						}
					},
					Promise.resolve(ob),
					Promise.resolve(5),
					undefined,
					null
				] )
				.catch( function(value) {
					assert.equal( value, 'b' );
					cb();
				} )
				.catch( function(e) {
					cb( e || new Error( 'reject handler called') );
				} );
		},

		'Promise.race sequence': function(cb) {

			var ob = {};

			Promise.race( {
					0: Promise.resolve(ob),
					1: Promise.resolve(5),
					length: 2
				} )
				.then( function(value) {

					assert.equal( value, ob);

					cb();

				} )
				.catch( function(e) {
					cb( e || new Error( 'reject handler called') );
				} );
		}


	};

	// Turn into event emitter

	var emitter = new EventEmitter();

	var cursor = -1;

	function fail( name, e ) {

		emitter.emit( 'fail', name, e );
		cb(false);
	}

	function pass( name ) {
		emitter.emit( 'pass', name );
		nextTest();
	}

	function nextTest() {
		
		++cursor;

		if ( cursor === Object.keys(tests).length ) {
			cb(true);
			return;
		}

		var testName = Object.keys(tests)[cursor];

		try {
			var called = false;
			tests[testName]( function(e) {
				
				if ( called ) {
					fail(testName, 'Callback already called');
					return;
				}
				called = true;

				if (e) {
					fail(testName,e);
					return;
				}
				pass(testName);
			} );

		} catch(e) {

			fail(testName,e);

		}

	}

	nextTest();

	return emitter;


};