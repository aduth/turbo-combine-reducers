const Benchmark = require( 'benchmark' );

const suite = new Benchmark.Suite;

[
	[ 'turbo-combine-reducers', require( '../' ) ],
	[ 'redux', require( 'redux' ).combineReducers ],
].forEach( ( [ name, combineReducers ] ) => {
	const action = { type: '__INERT__' };

	let state;
	suite.on( 'cycle', () => state = undefined );

	function createReducerObjectOfNumKeys( numKeys ) {
		const returnZero = () => 0;
		const aToY = [
			...Array( numKeys ).keys(),
		].map( ( offset ) => String.fromCharCode( 97 + offset ) );
		const reducers = {};
		aToY.forEach( ( key ) => reducers[ key ] = returnZero );
		return reducers;
	}

	[ 4, 20 ].forEach( ( numKeys ) => {
		const unchangingReducer = combineReducers( createReducerObjectOfNumKeys( numKeys ) );
		const changingReducer = ( () => {
			const reducers = createReducerObjectOfNumKeys( numKeys );
			// Pierce abstraction for worst-case scenario: Updated key is the last
			// one to be considered (iterating in reverse).
			reducers[ Object.keys( reducers )[ 0 ] ] = ( reducerState = 0 ) => reducerState + 1;
			return combineReducers( reducers );
		} )();

		suite
			.add( name + ' - unchanging (' + numKeys + ' properties)', () => {
				unchangingReducer( state, action );
			} )
			.add( name + ' - changing (' + numKeys + ' properties)', () => {
				changingReducer( state, action );
			} );
	} );
} );

suite
	// eslint-disable-next-line no-console
	.on( 'cycle', ( event ) => console.log( event.target.toString() ) )
	.run( { async: true } );
