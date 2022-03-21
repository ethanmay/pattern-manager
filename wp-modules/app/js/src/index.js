// @ts-check

/**
 * Fse Studio
 */

import './../../css/src/index.scss';
import './../../css/src/tailwind.css';

import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import ReactDOM from 'react-dom';

// Icons
import {
	Icon,
	wordpress,
	layout,
	file,
	globe,
	close,
	chevronLeft,
} from '@wordpress/icons';

import FseStudioContext from './contexts/FseStudioContext';

// Hooks
import useThemes from './hooks/useThemes';
import useCurrentId from './hooks/useCurrentId';
import useThemeData from './hooks/useThemeData';
import useThemeJsonFiles from './hooks/useThemeJsonFiles';
import useThemeJsonFile from './hooks/useThemeJsonFile';
import usePatterns from './hooks/usePatterns';
import useCurrentView from './hooks/useCurrentView';
import useStudioContext from './hooks/useStudioContext';

// Components
import ThemeManager from './components/ThemeManager';
import PatternEditor from './components/PatternEditor';
import ThemeJsonEditor from './components/ThemeJsonEditor';

// Utils
import classNames from './utils/classNames';

/**
 * @typedef {{
 *  apiEndpoints: {
 *   getPatternEndpoint: string,
 *   getThemeEndpoint: string,
 *   getThemeJsonFileEndpoint: string,
 *   savePatternEndpoint: string,
 *   saveThemeEndpoint: string,
 *   saveThemeJsonFileEndpoint:	string
 *  },
 *  blockEditorSettings: Partial<{
 *   '__unstableResolvedAssets': {styles: string},
 *   styles: Record<string, unknown>[]
 *  }>,
 *  initialTheme: string,
 *  patterns: Record<string, import('./components/PatternPicker').Pattern>,
 *  siteUrl: string,
 *  themeJsonFiles: Record<string, {
 *   content: string,
 *   name: string,
 *   patternPreviewParts?: import('./hooks/useThemeJsonFile').ThemeData | null
 *  }>,
 *  themes: Record<string, import('./hooks/useThemeData').Theme>
 * }} InitialFseStudio
 */

/**
 * @typedef {{
 *  currentView: ReturnType<import('./hooks/useCurrentView').default>,
 *  patterns: ReturnType<import('./hooks/usePatterns').default>,
 *  themes: ReturnType<import('./hooks/useThemes').default>,
 *  currentThemeId: ReturnType<import('./hooks/useCurrentId').default>,
 *  currentTheme: ReturnType<import('./hooks/useThemeData').default>,
 *  themeJsonFiles: ReturnType<import('./hooks/useThemeJsonFiles').default>,
 *  currentThemeJsonFileId: ReturnType<import('./hooks/useCurrentId').default>,
 *  currentThemeJsonFile: ReturnType<import('./hooks/useThemeJsonFile').default>,
 *  siteUrl: InitialFseStudio['siteUrl'],
 *  apiEndpoints: InitialFseStudio['apiEndpoints'],
 *  blockEditorSettings: InitialFseStudio['blockEditorSettings']
 * }} InitialContext
 */

// @ts-ignore The global window.fsestudio exists.
export const fsestudio = /** @type {InitialFseStudio} */ ( window.fsestudio );

ReactDOM.render( <FseStudioApp />, document.getElementById( 'fsestudioapp' ) );

function FseStudioApp() {
	const currentThemeJsonFileId = useCurrentId();
	const currentThemeJsonFile = useThemeJsonFile(
		currentThemeJsonFileId.value
	);
	const themes = useThemes( {
		themes: fsestudio.themes,
		currentThemeJsonFile,
	} );
	const currentThemeId = useCurrentId( fsestudio.initialTheme );
	const themeJsonFiles = useThemeJsonFiles( fsestudio.themeJsonFiles );

	/** @type {InitialContext} */
	const providerValue = {
		currentView: useCurrentView( 'theme_manager' ),
		patterns: usePatterns( fsestudio.patterns ),
		themes,
		currentThemeId,
		currentTheme: useThemeData(
			currentThemeId.value,
			themes,
			currentThemeJsonFile
		),
		themeJsonFiles,
		currentThemeJsonFileId,
		currentThemeJsonFile,
		siteUrl: fsestudio.siteUrl,
		apiEndpoints: fsestudio.apiEndpoints,
		blockEditorSettings: fsestudio.blockEditorSettings,
	};

	return (
		<FseStudioContext.Provider value={ providerValue }>
			<FseStudio />
		</FseStudioContext.Provider>
	);
}

function FseStudio() {
	// @ts-ignore
	const { currentView, currentTheme } = useStudioContext();
	const [ sidebarOpen, setSidebarOpen ] = useState(
		! JSON.parse( window.localStorage.getItem( 'fseStudioSidebarClosed' ) )
	);

	const navigation = [
		{
			name: 'Theme Manager',
			slug: 'theme_manager',
			icon: file,
			available: true,
		},
		{
			name: 'Pattern Manager',
			slug: 'pattern_manager',
			icon: layout,
			available: currentTheme.existsOnDisk,
		},
		{
			name: 'Theme.json Manager',
			slug: 'themejson_manager',
			icon: globe,
			available: currentTheme.existsOnDisk,
		},
	];

	useEffect( () => {
		// @ts-ignore
		window.localStorage.setItem( 'fseStudioSidebarClosed', ! sidebarOpen );
	}, [ sidebarOpen ] );

	function renderCurrentView() {
		return (
			<>
				<ThemeManager
					visible={ 'theme_manager' === currentView.currentView }
				/>
				<PatternEditor
					visible={ 'pattern_manager' === currentView.currentView }
				/>
				<ThemeJsonEditor
					visible={ 'themejson_manager' === currentView.currentView }
				/>
			</>
		);
	}

	return (
		<>
			<div className={ sidebarOpen ? 'sidebar-open' : 'sidebar-closed' }>
				{ /* Static sidebar for desktop */ }
				<div
					className={ `hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 ${
						sidebarOpen ? 'sidebar-open' : '!hidden'
					}` }
				>
					<div className="flex-1 flex flex-col min-h-0 bg-wp-black">
						<div className="flex items-center h-16 flex-shrink-0 px-3">
							<button
								className="text-white font-semibold"
								onClick={ () => setSidebarOpen( true ) }
							>
								<Icon
									className="text-white fill-current"
									icon={ wordpress }
									size={ 36 }
								/>
							</button>
							<span className="text-white font-semibold ml-4 grow">
								{ __( 'FSE Studio', 'fse-studio' ) }
							</span>
							<button
								className="text-white font-semibold ml-4"
								onClick={ () => setSidebarOpen( false ) }
							>
								<Icon
									className="text-white fill-current"
									icon={ close }
									size={ 30 }
								/>
							</button>
						</div>
						<div className="flex items-center text-white opacity-70 group hover:opacity-100 my-8 px-6">
							<Icon
								className="fill-current"
								icon={ chevronLeft }
								size={ 24 }
							/>
							<a href="index.php">
								{ __( 'Dashboard', 'fse-studio' ) }
							</a>
						</div>
						<div className="flex-1 flex flex-col overflow-y-auto">
							<h3 className="text-white font-semibold text-xl px-8">
								{ __( 'FSE Studio', 'fse-studio' ) }
							</h3>
							<nav className="flex-1 px-4 py-4 space-y-1">
								{ navigation.map( ( item ) => {
									return (
										<button
											disabled={ ! item.available }
											key={ item.name }
											onClick={ () => {
												currentView.set( item.slug );
											} }
											className={ classNames(
												item.slug ===
													currentView.currentView
													? 'bg-wp-blue text-white hover:text-white'
													: 'text-white opacity-70 hover:text-white hover:opacity-100',
												'group flex items-center px-4 py-2 text-sm font-medium rounded-sm w-full',
												! item.available
													? 'opacity-30 hover:opacity-30'
													: ''
											) }
										>
											<Icon
												className={ classNames(
													item.current
														? 'text-white'
														: 'text-white opacity-70 group-hover:opacity-100 group-hover:text-white',
													'mr-3 flex-shrink-0 h-6 w-6 fill-current',
													! item.available
														? 'opacity-30 hover:opacity-30'
														: ''
												) }
												icon={ item.icon }
												size={ 24 }
											/>
											{ item.name }
										</button>
									);
								} ) }
							</nav>
						</div>
					</div>
				</div>

				<button
					className={ `bg-wp-black px-3 py-3.5 absolute ${
						sidebarOpen ? 'hidden' : ''
					}` }
					onClick={ () => setSidebarOpen( true ) }
				>
					<Icon
						className="text-white fill-current"
						icon={ wordpress }
						size={ 36 }
					/>
				</button>

				<div
					className={ `md:pl-80 flex flex-col ${
						sidebarOpen ? 'md:pl-80' : 'md:pl-0'
					}` }
				>
					<main className="flex-1">{ renderCurrentView() }</main>
				</div>
			</div>
		</>
	);
}