<?php

require_once PODS_GUTENBERG_DIR . 'includes/blocks/class-pods-block.php';

class Pods_Blocks {

	/**
	 * @var Pods_Block[]
	 */
	private static $_blocks = array();

	/**
	 * Initialize REST API route.
	 *
	 * @since  1.0
	 * @access public
	 */
	public function __construct() {

		add_action( 'rest_api_init', array( $this, 'register_preview_route' ) );

	}

	/**
	 * Register a block type.
	 *
	 * @since  1.0
	 * @access public
	 *
	 * @param Pods_Block $block Block class.
	 *
	 * @uses   Pods_Block::get_type()
	 *
	 * @throws Exception
	 */
	public static function register( $block ) {

		if ( ! is_subclass_of( $block, 'Pods_Block' ) ) {
			throw new Exception( 'Must be a subclass of Pods_Block' );
		}

		// Get block type.
		$block_type = $block->get_type();

		if ( empty( $block_type ) ) {
			throw new Exception( 'The Pods block type must be set' );
		}

		if ( isset( self::$_blocks[ $block_type ] ) ) {
			throw new Exception( 'Pods Block type already registered: ' . $block_type );
		}

		// Register block.
		self::$_blocks[ $block_type ] = $block;

		// Initialize block.
		call_user_func( array( $block, 'init' ) );

	}

	/**
	 * Get instance of block.
	 *
	 * @since  1.0
	 * @access public
	 *
	 * @param string $block_type Block type.
	 *
	 * @return Pods_Block|bool
	 */
	public static function get( $block_type ) {

		return isset( self::$_blocks[ $block_type ] ) ? self::$_blocks[ $block_type ] : false;

	}

	// # BLOCK PREVIEW -------------------------------------------------------------------------------------------------

	/**
	 * Register REST API route to preview block.
	 *
	 * @since  1.0
	 * @access public
	 *
	 * @uses   Pods_Blocks::get_block_preview()
	 */
	public function register_preview_route() {

		$namespace        = 'pods/v2';
		$preview_endpoint = '/block/%s/preview';

		$preview_types = array(
			'single'        => array(
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
			),
			'list'          => array(
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
			),
			'field'         => array(
				'pod'   => array(
					'description' => __( 'The pod name.', 'pods-gutenberg-blocks' ),
					'required'    => true,
				),
				'slug'  => array(
					'description' => __( 'The item slug or ID.', 'pods-gutenberg-blocks' ),
					'required'    => true,
				),
				'field' => array(
					'description' => __( 'The pod field name.', 'pods-gutenberg-blocks' ),
					'required'    => true,
				),
			),
			'field-current' => array(
				'field' => array(
					'description' => __( 'The pod field name.', 'pods-gutenberg-blocks' ),
					'required'    => true,
				),
			),
			'form'          => array(
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
			),
			'view'          => array(
				'view'       => array(
					'description' => __( 'The view path.', 'pods-gutenberg-blocks' ),
					'required'    => true,
				),
				'cache_mode' => array(
					'description' => __( 'The cache mode.', 'pods-gutenberg-blocks' ),
					'default'     => 'none',
				),
				'expires'    => array(
					'description' => __( 'The cache expiration length.', 'pods-gutenberg-blocks' ),
					'type'        => 'integer',
					'default'     => 0,
				),
			),
			'page'          => array(
				'pods_page' => array(
					'description' => __( 'The pods page.', 'pods-gutenberg-blocks' ),
					'required'    => true,
				),
			),
		);

		foreach ( $preview_types as $preview_type => $preview_args ) {
			register_rest_route( $namespace, sprintf( $preview_endpoint, $preview_type ), array(
				array(
					'methods'  => WP_REST_Server::READABLE,
					'callback' => array( $this, 'get_block_preview' ),
					'args'     => $preview_args,
				),
			) );
		}

	}

	/**
	 * Prepare form HTML for block preview.
	 *
	 * @since  1.0-dev-2
	 * @access public
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @uses   WP_REST_Request::get_params()
	 */
	public function get_block_preview( $request ) {

		// Get request arguments.
		$attributes = $request->get_params();

		// Get preview markup.
		$html = self::get( $attributes['type'] ) ? self::get( $attributes['type'] )
		                                               ->preview_block( $attributes ) : false;

		if ( false !== $html ) {
			wp_send_json_success( array( 'html' => trim( $html ) ) );
		} else {
			wp_send_json_error();
		}

	}

}

new Pods_Blocks();

// Load all the block files automatically.
foreach ( glob( plugin_dir_path( __FILE__ ) . 'blocks/class-pods-block-*.php' ) as $filename ) {
	require_once $filename;
}
