<?php

class Pods_Block_Single extends Pods_Block {

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
	public $type = 'pods/single';

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
			'pod'      => array(
				'description' => __( 'The pod name.', 'pods-gutenberg-blocks' ),
				'required'    => true,
			),
			'slug'     => array(
				'description' => __( 'The item slug or ID.', 'pods-gutenberg-blocks' ),
				'required'    => true,
			),
			'template' => array(
				'description' => __( 'The template name.', 'pods-gutenberg-blocks' ),
			),
			'content'  => array(
				'description' => __( 'The template name.', 'pods-gutenberg-blocks' ),
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

		$config['title']       = esc_html__( 'Pods - Single Item', 'pods-gutenberg-blocks' );
		$config['description'] = esc_html__( 'Display a single Pod item', 'pods-gutenberg-blocks' );

		return $config;

	}

}

try {
	// Register block.
	Pods_Blocks::register( Pods_Block_Single::get_instance() );
} catch ( Exception $e ) {
	// Log that block could not be registered.
	pods_error( 'Unable to register block; ' . $e->getMessage() );
}
