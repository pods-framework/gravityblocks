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

	/**
	 * Get REST API parameters for preview.
	 *
	 * @since  1.0
	 * @access public
	 *
	 * @return array
	 */
	public function get_rest_api_params() {

		return array(
			'pods_page' => array(
				'description' => __( 'The pods page.', 'pods-gutenberg-blocks' ),
				'required'    => true,
			),
		);

	}

	/**
	 * Get Gutenberg Block JS config.
	 *
	 * @since  1.0
	 * @access public
	 *
	 * @return array
	 */
	public function get_block_config() {

		$config = parent::get_block_config();

		$config['title']       = esc_html__( 'Pods - Pod Page Content', 'pods-gutenberg-blocks' );
		$config['description'] = esc_html__( 'Embed content from a Pods Page', 'pods-gutenberg-blocks' );

		return $config;

	}

}

if ( class_exists( 'Pods_Pages' ) ) {
	try {
		// Register block.
		Pods_Blocks::register( Pods_Block_Page::get_instance() );
	} catch ( Exception $e ) {
		// Log that block could not be registered.
		pods_error( 'Unable to register block; ' . $e->getMessage() );
	}
}
