function combineReducers( reducers ) {
	var keys = Object.keys( reducers ),
		getNextState;

	getNextState = ( function() {
		var fn, i, key;

		fn = 'return {';
		for ( i = 0; i < keys.length; i++ ) {
			// `eval` security: The only dynamic contents are the reducer keys
			// used as string literals of the object properties. To ensure that
			// the property would not prematurely terminate the string literal
			// token, and considering termination by its ending single quote,
			// remove any single quotes of the key.
			//
			// "A string literal is zero or more Unicode code points enclosed
			// in single or double quotes."
			//
			// See: https://www.ecma-international.org/ecma-262/9.0/index.html#sec-literals-string-literals
			key = keys[ i ].replace( /'/g, '' );

			fn += '\'' + key + '\':r[\'' + key + '\'](s[\'' + key + '\'],a),';
		}
		fn += '}';

		return new Function( 'r,s,a', fn );
	} )();

	return function combinedReducer( state, action ) {
		var nextState, i, key;

		// Assumed changed if initial state.
		if ( state === undefined ) {
			return getNextState( reducers, {}, action );
		}

		nextState = getNextState( reducers, state, action );

		// Determine whether state has changed.
		i = keys.length;
		while ( i-- ) {
			key = keys[ i ];
			if ( state[ key ] !== nextState[ key ] ) {
				// Return immediately if a changed value is encountered.
				return nextState;
			}
		}

		return state;
	};
}

module.exports = combineReducers;
