<?php
/**
 * Frost: Section with media, text, buttons.
 *
 * @package fse-studio
 */

return array(
	'title'         => __( 'Section with media, text, buttons.', 'fse-studio' ),
	'name'          => 'frost-hero-section-two-columns',
	'categories'    => array( 'frost-hero-section' ),
	'viewportWidth' => 1280,
	'content'       => '<!-- wp:group {"align":"full","layout":{"inherit":true}} -->
<div class="wp-block-group alignfull"><!-- wp:spacer -->
<div style="height:100px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:media-text {"mediaPosition":"right","mediaId":3485,"mediaLink":"https://frostwp.com/patterns/hero-section/sample-black_1200x1200/","mediaType":"image","mediaWidth":40} -->
<div class="wp-block-media-text alignwide has-media-on-the-right is-stacked-on-mobile" style="grid-template-columns:auto 40%"><figure class="wp-block-media-text__media"><img src="https://frostwp.com/wp-content/uploads/2021/12/sample-black_1200x1200-1024x1024.jpg" alt="Sample Image" class="wp-image-3485 size-full"/></figure><div class="wp-block-media-text__content"><!-- wp:heading {"fontSize":"x-large"} -->
<h2 class="has-x-large-font-size" id="text-on-left-image-on-right">Text on left, media on right.</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Lorem ipsum dolor sit amet, consectetur adipiscing vestibulum. Fringilla nec accumsan eget, facilisis mi justo, luctus pellentesque gravida vitae non diam accumsan posuere, venenatis mi turpis.</p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"style":{"border":{"radius":0}},"className":"is-style-fill"} -->
<div class="wp-block-button is-style-fill"><a class="wp-block-button__link no-border-radius">Get Started</a></div>
<!-- /wp:button -->

<!-- wp:button {"style":{"border":{"radius":0}},"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link no-border-radius">Learn More</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div></div>
<!-- /wp:media-text -->

<!-- wp:spacer -->
<div style="height:100px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer --></div>
<!-- /wp:group -->',
);
