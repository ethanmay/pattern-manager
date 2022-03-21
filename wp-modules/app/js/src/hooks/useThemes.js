// @ts-check

import * as React from 'react';
import { useState, useEffect } from '@wordpress/element';

/**
 * @param {{
 *  themes: typeof import('../').fsestudio.themes,
 *  currentThemeJsonFile: ReturnType<import('./useThemeJsonFile').default>
 * }} The themes.
 */
export default function useThemes( { themes, currentThemeJsonFile } ) {
	/** @type {[typeof import('../').fsestudio.themes, React.Dispatch<React.SetStateAction<typeof import('../').fsestudio.themes>>]} */
	const [ theThemes, setTheThemes ] = useState( themes );

	useEffect( () => {
		currentThemeJsonFile.get();
	}, [ theThemes ] );

	return {
		themes: theThemes,
		setThemes: setTheThemes,
	};
}