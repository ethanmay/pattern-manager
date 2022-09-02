import {
	getNestedValue,
	setNestedObject,
	_validateObjectLevel,
} from '../nestedObjectUtility';

describe( 'getNestedValue', () => {
	it.each( [
		// Order is: object, keys, expectedValue.
		[ [ { a: 'nestedValue' } ], [ 0, 'a' ], 'nestedValue' ],
		[ { a: { b: [ 'nestedValue' ] } }, [ 'a', 'b', 0 ], 'nestedValue' ],
		[
			{ a: { b: [ true, 33, 'nestedValue' ] } },
			[ 'a', 'b', '2' ],
			'nestedValue',
		],
		[
			{
				a: {
					b: [
						true,
						{},
						{
							c: [ { d: 'nestedValue' }, false, 1, 2, {}, 3, 4 ],
							e: 'anotherString',
							f: {
								g: [],
							},
						},
					],
				},
			},
			[ 'a', 'b', '2', 'c', 0, 'd' ],
			'nestedValue',
		],
	] )(
		'should return a deeply nested value',
		( object, keys, expectedValue ) => {
			expect( getNestedValue( object, keys ) ).toEqual( expectedValue );
		}
	);
} );

describe( 'setNestedObject', () => {
	// Should strict equal...
	it.each( [
		// Order is: value, defaultValue, keys, object, newObject.
		[ 'newValue', null, [ 'a' ], { a: 'staleValue' }, { a: 'newValue' } ],
		[ false, null, [ 'a', 'b' ], { a: { b: {} } }, { a: { b: false } } ],
		[ false, false, [ 'a', 'b' ], { a: { b: {} } }, { a: { b: false } } ],
		[ null, null, [ 'a', 'b' ], { a: { b: {} } }, { a: { b: null } } ],
		[
			'newValue',
			null,
			[ 'a', 'b', 0 ],
			{ a: { b: {} } },
			{ a: { b: [ 'newValue' ] } },
		],
		[
			'newValue',
			null,
			[ 'a', 'b', '0', 'c', 'd', 4, 'e' ],
			{
				version: 2,
				a: {
					b: [
						{
							c: {
								d: [
									null,
									true,
									'random',
									{},
									{
										e: 'stalevalue',
									},
								],
							},
						},
					],
				},
			},
			{
				version: 2,
				a: {
					b: [
						{
							c: {
								d: [
									null,
									true,
									'random',
									{},
									{
										e: 'newValue',
									},
								],
							},
						},
					],
				},
			},
		],
		[
			{
				name: 'New Duotone',
				slug: 'new-duotone',
				color: [],
			},
			null,
			[ 'settings', 'color', 'duotone', '0' ],
			{
				version: 2,
				settings: {}, // Start from almost empty theme.json schema.
			},
			{
				version: 2,
				settings: {
					color: {
						duotone: [
							{
								name: 'New Duotone',
								slug: 'new-duotone',
								color: [],
							},
						],
					},
				},
			},
		],
		[
			{
				name: 'New Color',
				slug: 'new-color',
				color: '#ffffff',
			},
			null,
			[ 'settings', 'color', 'palette', '0' ],
			{
				version: 2,
				settings: {
					color: {}, // Add a level — previously failing before _validateObjectLevel.
				},
			},
			{
				version: 2,
				settings: {
					color: {
						palette: [
							{
								name: 'New Color',
								slug: 'new-color',
								color: '#ffffff',
							},
						],
					},
				},
			},
		],
		[
			{
				name: 'New Color',
				slug: 'new-color',
				color: '#ffffff',
			},
			null,
			[ 'settings', 'color', 'palette', '0' ],
			{
				version: 2,
				settings: {
					color: {
						palette: {}, // Malformed shape — should be an array. _validateObjectLevel will update.
						custom: false,
						duotone: [
							{
								name: '1',
								slug: '1',
								colors: [],
							},
							{
								name: '3',
								slug: '3',
								colors: [],
							},
							{
								name: '4',
								slug: '4',
								colors: [],
							},
						],
					},
				},
			},
			{
				version: 2,
				settings: {
					color: {
						palette: [
							{
								name: 'New Color',
								slug: 'new-color',
								color: '#ffffff',
							},
						],
						custom: false,
						duotone: [
							{
								name: '1',
								slug: '1',
								colors: [],
							},
							{
								name: '3',
								slug: '3',
								colors: [],
							},
							{
								name: '4',
								slug: '4',
								colors: [],
							},
						],
					},
				},
			},
		],
	] )(
		'should updated a deeply nested value',
		( value, defaultValue, keys, object, newObject ) => {
			expect(
				setNestedObject( value, defaultValue, keys )( object )
			).toStrictEqual( newObject );
		}
	);

	// Should not equal...
	it.each( [
		// Order is: value, defaultValue, keys, object, newObject.
		[ 'newValue', null, [ 'a' ], { a: 'staleValue' }, { a: 'staleValue' } ],
		[ false, null, [ 'a', 'b' ], { a: { b: {} } }, { a: { b: {} } } ],
	] )(
		'should updated a deeply nested value',
		( value, defaultValue, keys, object, newObject ) => {
			expect(
				setNestedObject( value, defaultValue, keys )( object )
			).not.toStrictEqual( newObject );
		}
	);
} );

describe( '_validateObjectLevel', () => {
	it.each( [
		// Order is: object, key, expected.
		[ undefined, 0, [] ],
		[ undefined, 'someKey', {} ],
		[ {}, 'someKey', {} ],
		[ [], 'someKey', {} ],
		[ [], 1, [] ],
		[ {}, 3, [] ],
		[ [ 'someValue' ], 0, [ 'someValue' ] ],
		[ [ 'someValue' ], 'someKey', [ 'someValue' ] ],
		[ { someKey: {} }, 'someKey', { someKey: {} } ],
		[ { someKey: false }, 'someKey', { someKey: false } ],
		[
			{ someKey: {}, keyToIgnore: true },
			'someKey',
			{ someKey: {}, keyToIgnore: true },
		],
	] )( 'should return the object or new shape', ( object, key, expected ) => {
		expect( _validateObjectLevel( object, key ) ).toEqual( expected );
	} );
} );
