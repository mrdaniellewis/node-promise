/**
 *	Promise tests
 */

var assert = require('assert');

var Promise = require('promise');
var style = require('styleconsole'); 


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


		}


	};

	// Thenable
	// resolve
	// reject
	// all
	// race
	// Turn into event emitter

	var cursor = -1;

	function fail( name, e ) {

		console.log( style.redBG.white( 'FAIL: ' + name ) );
		console.log( style.red(e) );
		cb(false);
	}

	function pass( name ) {
		console.log( style.green( 'PASS: ' + name ) );
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

		

	/*	.then( undefined, function(value) {
			++count;
			checkCount( 6, 'Second promise rejected' );
			checkValue( 'bar', value, 'Check reject returned value' );
		} )
		.then(
			function() {
				++count;
				checkCount( 7, 'Resolution follows caught value' );
			},
			function() {
				checkCount( NaN, 'Unreachable code' );
			}
		)
		.then( function() {
			++count;
			checkCount( 8, 'Creating Promise.resolve' );
			return Promise.resolve();
		} )
		.then(
			function() {
				++count;
				checkCount( 9, 'Promise.resolve' );
			},
			function() {
				checkCount( NaN, 'Unreachable code' );
			}
		)
		.then( function() {
			++count;
			checkCount( 10, 'Creating Promise.reject' );
			return Promise.reject();
		} )
		.then(
			function() {
				checkCount( NaN, 'Unreachable code' );
			},
			function() {
				++count;
				checkCount( 11, 'Promise.reject' );	
			}
		)
		.then( function() {
			++count;
			checkCount( 12, 'Creating Promise.resolve' );
			return Promise.resolve('fee');
		} )
		.then()
		.then( 
			function(value) {
				++count;
				checkCount( 13, 'Resolve passes through undefined' );
				checkValue( 'fee', value, 'Check resolve fallthrough value' );
			},
			function() {
				checkCount( NaN, 'Unreachable code' );
			}
		)
		.then( function() {
			++count;
			checkCount( 14, 'Creating Promise.reject' );
			return Promise.reject('foe');
		} )
		.then()
		.then( 
			function() {
				checkCount( NaN, 'Unreachable code' );
			},
			function(value) {
				++count;
				checkCount( 15, 'Reject passes through undefined' );
				checkValue( 'foe', value, 'Check reject fallthrough value' );	
			}
		)
		.then( function(value) {
			++count;
			checkCount( 16, 'Test throwing' );
			throw 'bar';
		} )
		.catch( function(value) {
			++count;
			checkCount( 17, 'Thrown value caught in catch' );
			checkValue( 'bar', value, 'Check thrown value' );	
			throw 'la';
		} )
		.then( undefined, function(value) {
			++count;
			checkCount( 18, 'Thrown value caught in then' );
			checkValue( 'la', value, 'Check thrown value' );	
			throw 'ti';
		} )
		.then( function() {
				checkCount( NaN, 'Unreachable code' );
		} )
		.then( undefined, function(value) {
			++count;
			checkCount( 19, 'Thrown value passes through undefined' );
			checkValue( 'ti', value, 'Check thrown value' );	
		} )
		.then( function(value) {
			
			return new Promise( function(resolve) {
				resolve();
			} ).then( function(value) {
				++count;
				checkCount( 20, 'Returned promised are followed' );
				return 'far';
			} );

		} )
        .then( function() {
            ++count;
			checkCount( 21, 'Returned promise value' );
			checkValue( 'far', value, 'Check returned value' );	
        } )
        .then( function() { // Not yet supported by Firefox
			var promise = new Promise(function(){});
			assert.strictEqual( promise, Promise.resolve(promise) );
			++count;
			checkCount( 22, 'resolve casting a promise to a promise' );                      
		} )
		.catch( function() {
			checkCount( NaN, 'Unreachable code' );
		} )
		.then( function() {
			var thenable = {
				then: function(resolve) {
					resolve('foo');
				}
			};

			++count;
			checkCount( 23, 'resolve casting a promise to a promise' );

			return Promise.resolve(thenable);                      
		} )
		.then( function(value) {
			++count;
			checkCount( 24, 'resolve cast thenable' );
			checkValue( 'foo', value, 'Check thenable return' );
			return {
				then: function(resolve) {
					resolve('bar');
				}
			}; 
		} )
        .then( function(value) {
			++count;
			checkCount( 25, 'resolve returned thenable' );
			checkValue( 'bar', value, 'Check thenable return' );
        })
       .then( function() {
          
           ++count;
			checkCount( 26, 'check resolved all' );
           
           
           return Promise.all( [
                'string',
                ob,
                {
                   then: function(resolve) {
                        ++count;
                       checkCount( 27, 'thenable in all' );
                       resolve('la');
                   }
                },
                Promise.resolve(ob),
                Promise.resolve(5),
                undefined,
                null
           ] );
       } )
       .then( function(value) {
           
           assert.strictEqual( Array.isArray(value), true, 'all returns array' );
           assert.strictEqual( value.length, 7, 'all array length' );
           assert.strictEqual( value[0], 'string' );
           assert.strictEqual( value[1], ob );
           assert.strictEqual( value[2], 'la' );
           assert.strictEqual( value[3], ob );
           assert.strictEqual( value[4], 5 );
           assert.strictEqual( value[5], undefined );
           assert.strictEqual( value[6], null );
           
           ++count;
		   checkCount( 28, 'all results' );
          
       } )
       .then( 
           null,
           function() {
			   checkCount( NaN, 'Unreachable code' );
	      } 
       )
       .then( function() {
          
           ++count;
		   checkCount( 29, 'check rejected all' );
           
           return Promise.all( [
                'string',
                ob,
                Promise.reject('ti'),
                {
                   then: function(resolve, reject) {
                       ++count;
                       checkCount( 30, 'all promises are run' );
                       reject('far');
                   }
                },
                {
                   then: function(resolve, reject) {
                       ++count;
                       checkCount( 31, 'all promises are run' );
                       reject('la');
                   }
                },
                Promise.resolve(5),
                undefined,
                Promise.reject('x')
           ] );
       } )
       .then( 
           function() {
			   checkCount( NaN, 'Unreachable code' );
	       },
           function(value) {
           ++count;
		   checkCount( 32, 'rejected and all promises are run' );
           checkValue( 'far', value, 'first rejected returned' );
       } )
       .then( function() {
          
           ++count;
		   checkCount( 33, 'check resolve race' );
           
           return Promise.race( [
               Promise.resolve('foo'), 
               {
                   then: function(resolve) {
                        ++count;
                       checkCount( 34, 'thenable in all' );
                       resolve('la');
                   }
                },
                'string',
                ob,
                Promise.resolve(ob),
                Promise.resolve(5),
                undefined,
                null
           ] );
       } )
	   .then( function(value) {
               ++count;
               checkCount( 35, 'race resolves' );
               checkValue( 'la', value, 'first resolved returned' );
          },
          function() {
             checkCount( NaN, 'Unreachable code' );
          }       
       )
       .then( function() {
          
           ++count;
		   checkCount( 36, 'check rejected race' );
           
           return Promise.race( [
         
                Promise.reject('ti'),
                {
                   then: function(resolve, reject) {
                       ++count;
                       checkCount( 37, 'all promises are run' );
                       reject('far');
                   }
                },
                {
                   then: function(resolve, reject) {
                       ++count;
                       checkCount( 38, 'all promises are run' );
                       reject('la');
                   }
                },
                Promise.resolve(5),
                undefined,
                Promise.reject('x')
           ] );
       } )
       .then( 
           function() {
			   checkCount( NaN, 'Unreachable code' );
	       },
           function(value) {
               ++count;
               checkCount( 39, 'rejected and all promises are run' );
               checkValue( 'far', value, 'first rejected returned' );
          } 
       )
       .then( function() {  
           // Check errors
           new Proimse();
       } )
       .then( 
           function() {
			   checkCount( NaN, 'Unreachable code' );
	       },
           function(e) {
               ++count;
               checkCount( 40, 'rejected and all promises are run' );
               checkValue( e instanceof, TypeError, 'Is a type error' );
               checkValue( e.message, 'You must pass a resolver function as the first argument to the promise constructor', 'Has the right message' );
          } 
       )*/
    
   


	// @todo values that are not funcations are ignore
    // @todo error meesages for all, race
    // @todo can only be resolved/rejected once


};