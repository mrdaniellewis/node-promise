/*
 * This is a JavaScript Scratchpad.
 *
 * Enter some JavaScript, then Right Click or choose from the Execute Menu:
 * 1. Run to evaluate the selected text (Cmd-r),
 * 2. Inspect to bring up an Object Inspector on the result (Cmd-i), or,
 * 3. Display to insert the result in a comment after the selection. (Cmd-l)
 */

var assert = {
    
    equal: function(value1,value2,message) {
        if ( value1 == value2 ) {
            return;
        }
        if ( message ) {
             var e = new Error( message );
              e.notes = value1 + '==' + value2;
            throw e;
        }
        throw new Error( value1 + '==' + value2 );
    },
     
    strictEqual: function(value1,value2,message) {
        if ( value1 === value2 ) {
            return;
        }
        if ( message ) {
             var e = new Error( message );
              e.notes = value1 + '==' + value2;
            throw e;
        }
        throw new Error( value1 + '==' + value2 );
    }, 

};

function test(cb) {

	var count = 0;
	function checkCount( check, message ) {
		try {
			assert.equal( count, check, message );
		} catch(e) {
			cb(e);
			return;
		}
		console.log(message);
	}

	function checkValue( value1, value2, message ) {
		try {
			assert.equal( value1, value2 );
		} catch(e) {
			cb(e);
			return;
		}
		console.log(message);
	}
    
    var ob = {};
    
	++count;
	checkCount( 1, 'Starting tests' );

	var promise = new Promise( function(resolve,reject) {	
			// Initiation function runs sync
			++count;
			checkCount( 2, 'Initiate first promise' );
			resolve('foo');
		} )
		.then( 
			function(value) {
				++count;
				checkCount( 4, 'First promise resolved' );
				checkValue( 'foo', value, 'Check promise returned value' );
				return new Promise( function(resolve,reject) {	
					++count;     
                    checkCount( 5, 'Initiate second promise' );
					reject('bar');
				} );

			}
		)
		.then( undefined, function(value) {
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
               resolve()
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
        })
        .then( function() {
            // Dummy test
            ++count;
        })
        /*.then( function() { // Not yet supported by Firefox
			var promise = new Promise(function(){});
			assert.strictEqual( promise, Promise.resolve(promise) );
			++count;
			checkCount( 22, 'resolve casting a promise to a promise' );                      
		} )*/
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
            return thenable = {
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
       )
    
   

	// @todo values that are not funcations are ignore
    // @todo error meesages for all, race



	// Checks they are running async
	++count;
	checkCount( 3, 'Promise setup' );

};


test( function(ret) {
    console.log( 'ERROR', ret)
    
} );

