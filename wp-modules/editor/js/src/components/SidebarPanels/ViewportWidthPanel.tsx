import { __ } from '@wordpress/i18n';
import { useState, useMemo } from '@wordpress/element';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { RangeControl } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';
import PatternPreview from '../../../../../app/js/src/components/PatternPreview';
import { patternManager } from '../../globals';

import type { BaseSidebarProps, AdditionalSidebarProps } from './types';
import type { Pattern } from '../../types';

export default function ViewportWidthPanel( {
	postMeta,
	handleChange,
	isSavingPost,
	isPostSavingLocked,
}: BaseSidebarProps &
	Pick< AdditionalSidebarProps, 'isSavingPost' | 'isPostSavingLocked' > ) {
	const [ previewIsVisible, setPreviewIsVisible ] = useState( false );
	const savedPatternName = useMemo( () => postMeta.name, [ isSavingPost ] );
	const viewportWidth = postMeta.viewportWidth || 1280;

	return (
		<PluginDocumentSettingPanel
			name="patternmanager-pattern-editor-pattern-viewport-width"
			title={ __( 'Viewport Width', 'pattern-manager' ) }
		>
			<RangeControl
				aria-label={ __(
					'Viewport Width Adjustment Slider (used for resizing the preview for the pattern)',
					'pattern-manager'
				) }
				help={ __(
					'Adjust preview width for the pattern.',
					'pattern-manager'
				) }
				min={ 640 }
				max={ 2560 }
				step={ 80 }
				value={ viewportWidth }
				onChange={ ( value: Pattern[ 'viewportWidth' ] ) => {
					handleChange( 'viewportWidth', value );
				} }
				onMouseMove={ () => setPreviewIsVisible( true ) }
				onMouseLeave={ () => setPreviewIsVisible( false ) }
			/>

			{ previewIsVisible &&
				( ! isPostSavingLocked ? (
					<PatternPreview
						url={
							patternManager.siteUrl +
							'?pm_pattern_preview=' +
							savedPatternName
						}
						viewportWidth={ viewportWidth }
					/>
				) : (
					<RichText.Content
						tagName="span"
						className="components-panel__row-patternmanager-pattern-name-error-inner"
						value={ 'Please update the pattern title.' }
					/>
				) ) }
		</PluginDocumentSettingPanel>
	);
}
