<?php

// If Pods cannot be found, exit.
if ( ! defined( 'PODS_VERSION' ) ) {
	die();
}

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

		require_once 'includes/class-pods-gutenberg.php';
		require_once 'includes/class-pods-blocks.php';

	}

}
