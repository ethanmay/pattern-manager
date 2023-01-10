import { useContext } from '@wordpress/element';
import NoticeContext from '../contexts/PatternManagerNoticeContext';

export default function useNoticeContext() {
	const context = useContext( NoticeContext );
	if ( ! context ) {
		throw new Error( 'useNoticeContext must be inside a provider' );
	}

	return context;
}
