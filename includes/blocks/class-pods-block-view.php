<?php

class Pods_Block_View extends Pods_Block {

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
	public $type = 'pods/view';

	// # BLOCK RENDER -------------------------------------------------------------------------------------------------

	/**
	 * Display block contents on frontend.
	 *
	 * @since  1.0
	 * @access public
	 *
	 * @param array $attributes Block attributes.
	 *
	 * @return string
	 */
	public function render_block( $attributes = array() ) {

		if ( empty( $attributes['view'] ) ) {
			return '';
		}

		if ( empty( $attributes['expires'] ) ) {
			$attributes['expires'] = false;
		}

		if ( empty( $attributes['cache_mode'] ) ) {
			$attributes['cache_mode'] = 'none';
		}

		return pods_view( $attributes['view'], array(), $attributes['expires'], $attributes['cache_mode'], true );

	}

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
			'view'       => array(
				'description' => __( 'The view path.', 'pods-gutenberg-blocks' ),
				'type'        => 'string',
				'default'     => '',
				'required'    => true,
			),
			'cache_mode' => array(
				'description' => __( 'The cache mode.', 'pods-gutenberg-blocks' ),
				'type'        => 'string',
				'default'     => 'none',
			),
			'expires'    => array(
				'description' => __( 'The cache expiration length.', 'pods-gutenberg-blocks' ),
				'type'        => 'integer',
				'default'     => 0,
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

		$config['title']       = esc_html__( 'Pods - Embed Theme File', 'pods-gutenberg-blocks' );
		$config['description'] = esc_html__( 'Include a file from a theme, with caching options', 'pods-gutenberg-blocks' );

		return $config;

	}

}

try {
	// Register block.
	Pods_Blocks::register( Pods_Block_View::get_instance() );
} catch ( Exception $e ) {
	// Log that block could not be registered.
	pods_error( 'Unable to register block; ' . $e->getMessage() );
}
