<?php

class Pods_Block_Page extends Pods_Block {

	/**
	 * Contains an instance of this block, if available.
	 *
	 * @since  1.0
	 * @access private
	 * @var    Pods_Block $_instance If available, contains an instance of this block.
	 */
	protected static $_instance = null;

	/**
	 * Block type.
	 *
	 * @var string
	 */
	public $type = 'pods/page';

}

try {
	// Register block.
	Pods_Blocks::register( Pods_Block_Page::get_instance() );
} catch ( Exception $e ) {
	// Log that block could not be registered.
	pods_error( 'Unable to register block; ' . $e->getMessage() );
}
