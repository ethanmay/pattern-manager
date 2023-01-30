import useNotice from './hooks/useNotice';
import usePatterns from './hooks/usePatterns';

export type PatternManagerViews = 'theme_patterns' | 'pattern_editor';

export type InitialContext = {
	siteUrl: InitialPatternManager[ 'siteUrl' ];
	apiEndpoints: InitialPatternManager[ 'apiEndpoints' ];
	notice: ReturnType< typeof useNotice >;
	patterns: ReturnType< typeof usePatterns >;
};

export type InitialPatternManager = {
	apiNonce: string;
	apiEndpoints: {
		savePatternsEndpoint: string;
	};
	siteUrl: string;
	adminUrl: string;
	patterns: Patterns;
};

export type Pattern = {
	content: string;
	name: string;
	title: string;
	slug: string;
	description?: string;
	categories?: string[];
	keywords?: string[];
	blockTypes?: string[];
	postTypes?: string[];
	inserter?: boolean;
	viewportWidth?: string | number;
};

export type Patterns = {
	[ key: string ]: Pattern;
};
