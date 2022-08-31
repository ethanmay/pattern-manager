// @ts-check

import * as React from 'react';
import { useState, useEffect } from '@wordpress/element';
import useMounted from './useMounted';

export default function useSnackbar() {
	const [ snackBarValue, setSnackBarValue ] = useState( '' );
	const [ displayThemeCreatedNotice, setDisplayThemeCreatedNotice ] = useState( false );
	const { isMounted } = useMounted();

	function removeSnackbarAfterDelay() {
		if ( ! snackBarValue ) {
			return;
		}
		setTimeout( () => {
			if ( isMounted() ) {
				setSnackBarValue( '' );
			}
		}, 7000 );
	}

	useEffect( () => {
		removeSnackbarAfterDelay();
	}, [ snackBarValue ] );

	return {
		snackBarValue,
		setSnackBarValue,
		displayThemeCreatedNotice,
		setDisplayThemeCreatedNotice,
	};
}
