// WP dependencies
import { SearchControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useState } from '@wordpress/element';

// Hooks
import usePmContext from '../../hooks/usePmContext';

// Components
import PatternCategories from './PatternCategories';
import PatternGrid from './PatternGrid';

// Utils
import getFilteredPatterns from '../../utils/getFilteredPatterns';
import getUniquePatternCategories from '../../utils/getUniquePatternCategories';

type Props = {
	isVisible: boolean;
};

export default function Patterns( { isVisible }: Props ) {
	const { patterns } = usePmContext();
	const [ currentCategory, setCurrentCategory ] = useState( 'all-patterns' );
	const [ searchTerm, setSearchTerm ] = useState( '' );

	if ( ! isVisible || ! patterns.data ) {
		return null;
	}

	const filteredPatterns = getFilteredPatterns(
		patterns.data,
		searchTerm,
		currentCategory
	);

	const patternCategories = getUniquePatternCategories( filteredPatterns );

	return (
		<div hidden={ ! isVisible } className="patternmanager-theme-patterns">
			<div className="patterns-container-inner">
				{ ! Object.entries( patterns.data ?? {} ).length ? (
					<div className="grid-empty">
						{ createInterpolateElement(
							__(
								'No patterns added yet. Click the <span></span> button to start creating and adding patterns.',
								'pattern-manager'
							),
							{
								span: (
									<strong>
										{ __(
											'Add New Pattern',
											'pattern-manager'
										) }
									</strong>
								),
							}
						) }
					</div>
				) : (
					<>
						<div className="inner-sidebar">
							<SearchControl
								className="pattern-search"
								value={ searchTerm }
								onChange={ ( newSearchTerm: string ) => {
									setSearchTerm( newSearchTerm );
								} }
							/>
							<PatternCategories
								categories={ patternCategories }
								currentCategory={ currentCategory }
								setCurrentCategory={ setCurrentCategory }
							/>
						</div>
						<div className="inner-grid">
							<PatternGrid themePatterns={ filteredPatterns } />
						</div>
					</>
				) }
			</div>
		</div>
	);
}
