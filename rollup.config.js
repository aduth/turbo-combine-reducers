export default {
	input: 'index.js',
	output: {
		file: 'dist/turbo-combine-reducers.js',
		name: 'turboCombineReducers',
		format: 'iife',
	},
	plugins: [
		require( 'rollup-plugin-commonjs' )()
	]
};
