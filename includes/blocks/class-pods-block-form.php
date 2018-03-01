<?php

class Pods_Block_Form extends Pods_Block {

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
	public $type = 'pods/form';

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

		return pods_shortcode_form( $attributes );

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
			'pod'       => array(
				'description' => __( 'The pod name.', 'pods-gutenberg-blocks' ),
				'required'    => true,
			),
			'slug'      => array(
				'description' => __( 'The item slug or ID.', 'pods-gutenberg-blocks' ),
			),
			'fields'    => array(
				'description' => __( 'The pod fields.', 'pods-gutenberg-blocks' ),
			),
			'label'     => array(
				'description' => __( 'The form label.', 'pods-gutenberg-blocks' ),
			),
			'thank_you' => array(
				'description' => __( 'The form thank you URL.', 'pods-gutenberg-blocks' ),
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

		$config['title']       = esc_html__( 'Pods - Form', 'pods-gutenberg-blocks' );
		$config['description'] = esc_html__( 'Display a form for creating and editing Pod items', 'pods-gutenberg-blocks' );

		return $config;

	}

}

try {
	// Register block.
	Pods_Blocks::register( Pods_Block_Form::get_instance() );
} catch ( Exception $e ) {
	// Log that block could not be registered.
	pods_error( 'Unable to register block; ' . $e->getMessage() );
}
