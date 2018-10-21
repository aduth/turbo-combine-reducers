const Benchmark = require( 'benchmark' );

const suite = new Benchmark.Suite;

[
	[ 'turbo-combine-reducers', require( '../' ) ],
	[ 'redux', require( 'redux' ).combineReducers ],
].forEach( ( [ name, combineReducers ] ) => {
	const action = { type: '__INERT__' };
	let state;

	function createReducerObjectOfNumKeys( numKeys ) {
		const returnZero = () => 0;
		const aToY = [
			...Array( numKeys ).keys(),
		].map( ( offset ) => String.fromCharCode( 97 + offset ) );
		const reducers = {};
		aToY.forEach( ( key ) => reducers[ key ] = returnZero );
		return reducers;
	}

	const unchangingReducer = combineReducers( createReducerObjectOfNumKeys( 4 ) );

	const bigObjectUnchangingReducer = ( () => {
		return combineReducers( createReducerObjectOfNumKeys( 20 ) );
	} )();

	const changingReducer = combineReducers( createReducerObjectOfNumKeys( 4 ) );

	const bigObjectChangingReducer = ( () => {
		const reducers = createReducerObjectOfNumKeys( 20 );
		// Pierce abstraction for worst-case scenario: Updated key is the last
		// one to be considered (iterating in reverse).
		reducers[ Object.keys( reducers )[ 0 ] ] = ( reducerState = 0 ) => reducerState + 1;
		return combineReducers( reducers );
	} )();

	suite
		.add( name + ' - unchanging (4 properties)', () => {
			unchangingReducer( state, action );
		} )
		.add( name + ' - unchanging (20 properties)', () => {
			bigObjectUnchangingReducer( state, action );
		} )
		.add( name + ' - changing (4 properties)', () => {
			changingReducer( state, action );
		} )
		.add( name + ' - changing (20 properties)', () => {
			bigObjectChangingReducer( state, action );
		} )
		.on( 'cycle', () => state = undefined );
} );

suite
	// eslint-disable-next-line no-console
	.on( 'cycle', ( event ) => console.log( event.target.toString() ) )
	.run( { async: true } );
