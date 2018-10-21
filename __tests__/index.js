const combineReducers = require( '../' );

describe( 'combineReducers', () => {
	it( 'creates function returning shape by reducers', () => {
		const reducer = combineReducers( {
			a: () => 1,
			b: () => 2,
		} );

		const state = reducer( undefined, {} );
		expect( state ).toEqual( { a: 1, b: 2 } );
	} );

	it( 'reflects updates to state', () => {
		const reducer = combineReducers( {
			a: ( state = 0 ) => state + 1,
		} );

		const firstState = reducer( undefined, {} );
		expect( firstState ).toEqual( { a: 1 } );

		const secondState = reducer( firstState, {} );
		expect( secondState ).not.toBe( firstState );
		expect( secondState ).toEqual( { a: 2 } );
	} );

	it( 'returns referentially equal value on unchanging state', () => {
		const reducer = combineReducers( {
			a: () => 1,
		} );

		const firstState = reducer( undefined, {} );
		expect( firstState ).toEqual( { a: 1 } );

		const secondState = reducer( firstState, {} );
		expect( secondState ).toBe( firstState );
		expect( secondState ).toEqual( { a: 1 } );
	} );

	it( 'is not susceptible to evil', () => {
		combineReducers( {
			'\\\':(function(){throw "EVIL"})()};//': () => 0,
			'\\":(function(){throw \'EVIL\'})()};//': () => 0,
			'\\': () => 0,
		} )();
	} );
} );
