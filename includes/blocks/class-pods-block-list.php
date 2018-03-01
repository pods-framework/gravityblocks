<?php

class Pods_Block_List extends Pods_Block {

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
	public $type = 'pods/list';

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
			'template' => array(
				'description' => __( 'The template name.', 'pods-gutenberg-blocks' ),
			),
			'content'  => array(
				'description' => __( 'The template name.', 'pods-gutenberg-blocks' ),
			),
			'where'    => array(
				'description' => __( 'The WHERE clause.', 'pods-gutenberg-blocks' ),
			),
			'groupby'  => array(
				'description' => __( 'The GROUP BY clause.', 'pods-gutenberg-blocks' ),
			),
			'having'   => array(
				'description' => __( 'The HAVING clause.', 'pods-gutenberg-blocks' ),
			),
			'orderby'  => array(
				'description' => __( 'The ORDER BY clause.', 'pods-gutenberg-blocks' ),
			),
			'limit'    => array(
				'description' => __( 'The number of items to limit to.', 'pods-gutenberg-blocks' ),
				'type'        => 'integer',
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

		$config['title']       = esc_html__( 'Pods - List Items', 'pods-gutenberg-blocks' );
		$config['description'] = esc_html__( 'List multiple Pod items', 'pods-gutenberg-blocks' );

		return $config;

	}

}

try {
	// Register block.
	Pods_Blocks::register( Pods_Block_List::get_instance() );
} catch ( Exception $e ) {
	// Log that block could not be registered.
	pods_error( 'Unable to register block; ' . $e->getMessage() );
}
