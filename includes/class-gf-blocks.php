<?php

require_once( plugin_dir_path( __FILE__ ) . 'blocks/class-gf-block.php' );

class GF_Blocks {

	/**
	 * @var GF_Block[]
	 */
	private static $_blocks = array();

	/**
	 * Initialize REST API route.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 */
	public function __construct() {

		add_action( 'rest_api_init', array( $this, 'register_preview_route' ) );

	}

	/**
	 * Register a block type.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 *
	 * @param GF_Block $block Block class.
	 *
	 * @uses   GF_Block::get_type()
	 *
	 * @throws Exception
	 */
	public static function register( $block ) {

		if ( ! is_subclass_of( $block, 'GF_Block' ) ) {
			throw new Exception( 'Must be a subclass of GF_Block' );
		}

		// Get block type.
		$block_type = $block->get_type();

		if ( empty( $block_type ) ) {
			throw new Exception( 'The type must be set' );
		}

		if ( isset( self::$_blocks[ $block_type ] ) ) {
			throw new Exception( 'Block type already registered: ' . $block_type );
		}

		// Register block.
		self::$_blocks[ $block_type ] = $block;

		// Initialize block.
		call_user_func( array( $block, 'init' ) );

	}

	/**
	 * Get instance of block.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 *
	 * @param string $block_type Block type.
	 *
	 * @return GF_Block|bool
	 */
	public static function get( $block_type ) {

		return isset( self::$_blocks[ $block_type ] ) ? self::$_blocks[ $block_type ] : false;

	}





	// # BLOCK PREVIEW -------------------------------------------------------------------------------------------------

	/**
	 * Register REST API route to preview block.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 *
	 * @uses   GF_Blocks::get_block_preview()
	 */
	public function register_preview_route() {

		register_rest_route( 'gf/v2', '/block/preview', array(
			array(
				'methods'  => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_block_preview' ),
				'args'     => array(
					'formId'      => array(
						'description' => __( 'The ID of the form displayed in the block.' ),
						'type'        => 'integer',
						'required'    => true,
					),
					'title'       => array(
						'description' => __( 'Whether to display the form title.' ),
						'type'        => 'boolean',
						'default'     => true,
					),
					'description' => array(
						'description' => __( 'Whether to display the form description.' ),
						'type'        => 'boolean',
						'default'     => true,
					),
					'ajax'        => array(
						'description' => __( 'Whether to embed the form using AJAX.' ),
						'type'        => 'boolean',
						'default'     => true,
					),
				),
			),
		) );

	}

	/**
	 * Prepare form HTML for block preview.
	 *
	 * @since  1.0-dev-2
	 * @access public
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @uses   GFAPI::get_form()
	 * @uses   WP_REST_Request::get_params()
	 */
	public function get_block_preview( $request ) {

		// Get request arguments.
		$attributes = $request->get_params();

		// Get form ID.
		$form_id = rgar( $attributes, 'formId' ) ? $attributes['formId'] : false;

		// If form ID was not provided or form does not exist, return.
		if ( ! $form_id || ( $form_id && ! GFAPI::get_form( $form_id ) ) ) {
			wp_send_json_error();
		}

		// Get preview markup.
		$html = self::get( $attributes['type'] ) ? self::get( $attributes['type'] )->preview_block( $attributes ) : false;

		if ( $html ) {
			wp_send_json_success( array( 'html' => trim( $html ) ) );
		} else {
			wp_send_json_error();
		}

	}


}

new GF_Blocks();

// Load all the block files automatically.
foreach ( glob( plugin_dir_path( __FILE__ ) . 'blocks/class-gf-block-*.php' ) as $filename ) {
	require_once( $filename );
}
