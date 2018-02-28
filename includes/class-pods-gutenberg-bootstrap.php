<?php

/**
 * Class Pods_Gutenberg_Bootstrap
 *
 * Handles the loading of the Gutenberg Add-On.
 */
class Pods_Gutenberg_Bootstrap {

	/**
	 * Load Pods_Blocks class.
	 *
	 * @access public
	 * @static
	 */
	public static function load_blocks() {

		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		require_once 'class-pods-gutenberg.php';
		require_once 'class-pods-blocks.php';

	}

}
