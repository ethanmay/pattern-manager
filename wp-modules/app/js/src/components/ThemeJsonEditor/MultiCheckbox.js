// @ts-check

import { CheckboxControl } from '@wordpress/components';

/**
 * @param {{
 *	value: Array,
 *  onChange: Function
 * }} props
 */
export default function MultiCheckbox( { value, onChange } ) {
	const units = [ 'px', 'em', 'rem', 'vh', 'vw', '%' ];

	return (
		<div>
			{ units.map( ( unit ) => {
				return (
					<CheckboxControl
						key={ unit }
						label={ unit }
						checked={ value.includes( unit ) }
						onChange={ onChange }
					/>
				);
			} ) }
		</div>
	);
}
