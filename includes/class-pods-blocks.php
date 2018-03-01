<?php

require_once PODS_GUTENBERG_DIR . 'includes/blocks/class-pods-block.php';

class Pods_Blocks {

	/**
	 * Contains an instance of this class, if available.
	 *
	 * @since  1.0
	 * @access private
	 * @var    Pods_Blocks $_instance If available, contains an instance of this class.
	 */
	protected static $_instance = null;

	/**
	 * @var Pods_Block[]
	 */
	private static $_blocks = array();

	/**
	 * Get instance of this class.
	 *
	 * @since  1.0
	 * @access public
	 * @static
	 *
	 * @return Pods_Blocks
	 */
	public static function get_instance() {

		if ( null === static::$_instance ) {
			$class = get_called_class();

			static::$_instance = new $class;
		}

		return static::$_instance;

	}

	/**
	 * Initialize class and add hooks.
	 *
	 * @since  1.0
	 * @access public
	 */
	public function __construct() {

		add_action( 'rest_api_init', array( $this, 'register_preview_route' ) );

		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_scripts' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_styles' ) );

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

		foreach ( self::$_blocks as $_block ) {
			$preview_type = str_replace( 'pods/', '', $_block->get_type() );

			$rest_api_params = $_block->get_rest_api_params();

			register_rest_route( $namespace, sprintf( $preview_endpoint, $preview_type ), array(
				array(
					'methods'  => WP_REST_Server::READABLE,
					'callback' => array( $this, 'get_block_preview' ),
					'args'     => $rest_api_params,
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

		$block = self::get( $attributes['type'] );

		$html = false;

		// Get preview markup.
		if ( $block ) {
			$html = $block->preview_block( $attributes );
		}

		if ( false !== $html ) {
			wp_send_json_success( array( 'html' => trim( $html ) ) );
		} else {
			wp_send_json_error();
		}

	}

	// # SCRIPT ENQUEUEING ---------------------------------------------------------------------------------------------

	/**
	 * Enqueue block scripts.
	 *
	 * @since  1.0
	 * @access public
	 *
	 * @uses   Pods_Block::scripts()
	 */
	public function enqueue_scripts() {

		// Get registered scripts.
		$scripts = $this->scripts();

		// If no scripts are registered, return.
		if ( empty( $scripts ) ) {
			return;
		}

		// Loop through scripts.
		foreach ( $scripts as $script ) {
			// Prepare parameters.
			$src       = isset( $script['src'] ) ? $script['src'] : false;
			$deps      = isset( $script['deps'] ) ? $script['deps'] : array();
			$version   = isset( $script['version'] ) ? $script['version'] : false;
			$in_footer = isset( $script['in_footer'] ) ? $script['in_footer'] : false;

			// Enqueue script.
			wp_enqueue_script( $script['handle'], $src, $deps, $version, $in_footer );

			// Localize script.
			if ( ! empty( $script['strings'] ) ) {
				wp_localize_script( $script['handle'], $script['handle'] . '_strings', $script['strings'] );
			}

			// Run script callback.
			if ( ! empty( $script['callback'] ) && is_callable( $script['callback'] ) ) {
				call_user_func( $script['callback'], $script );
			}
		}

	}

	/**
	 * Override this function to provide a list of scripts to be enqueued.
	 * Following is an example of the array that is expected to be returned by this function:
	 * <pre>
	 * <code>
	 *
	 *    array(
	 *        array(
	 *            'handle'   => 'super_signature_script',
	 *            'src'      => $this->get_base_url() . '/super_signature/ss.js',
	 *            'version'  => $this->_version,
	 *            'deps'     => array( 'jquery'),
	 *            'callback' => array( $this, 'localize_scripts' ),
	 *            'strings'  => array(
	 *                // Accessible in JavaScript using the global variable "[script handle]_strings"
	 *                'stringKey1' => __( 'The string', 'pods-gutenberg-blocks' ),
	 *                'stringKey2' => __( 'Another string.', 'pods-gutenberg-blocks' )
	 *            )
	 *        )
	 *    );
	 *
	 * </code>
	 * </pre>
	 *
	 * @since  1.0
	 * @access public
	 *
	 * @return array
	 */
	public function scripts() {

		$scripts = array(
			array(
				'handle'   => 'pods_gutenberg',
				'src'      => PODS_GUTENBERG_URL . 'js/blocks/core.min.js',
				'deps'     => array( 'wp-blocks', 'wp-element' ),
				'version'  => filemtime( PODS_GUTENBERG_DIR . 'js/blocks/core.min.js' ),
				'callback' => array( $this, 'localize_script' ),
			),
		);

		foreach ( self::$_blocks as $block ) {
			$block_scripts = $block->scripts();

			foreach ( $block_scripts as $script ) {
				$scripts[] = $script;
			}
		}

		return $scripts;

	}

	/**
	 * Localize core block script.
	 *
	 * @since  1.0
	 * @access public
	 *
	 * @param array $script Script arguments.
	 */
	public function localize_script( $script = array() ) {

		$block_configs = array();

		foreach ( self::$_blocks as $block ) {
			$type = pods_js_name( $block->get_type() );

			$block_configs[ $type ] = $block->get_block_config();
		}

		wp_localize_script( $script['handle'], 'pods_gutenberg', array(
			'pods'               => pods_gutenberg()->get_pods(),
			'conditionalOptions' => pods_gutenberg()->get_conditional_options(),
			'icon'               => PODS_GUTENBERG_URL . 'images/blocks/core/icon.svg',
			'block_configs'      => $block_configs,
		) );

	}

	// # STYLE ENQUEUEING ----------------------------------------------------------------------------------------------

	/**
	 * Enqueue block styles.
	 *
	 * @since  1.0
	 * @access public
	 */
	public function enqueue_styles() {

		// Get registered styles.
		$styles = $this->styles();

		// If no styles are registered, return.
		if ( empty( $styles ) ) {
			return;
		}

		// Loop through styles.
		foreach ( $styles as $style ) {
			// Prepare parameters.
			$src     = isset( $style['src'] ) ? $style['src'] : false;
			$deps    = isset( $style['deps'] ) ? $style['deps'] : array();
			$version = isset( $style['version'] ) ? $style['version'] : false;
			$media   = isset( $style['media'] ) ? $style['media'] : 'all';

			// Enqueue style.
			wp_enqueue_style( $style['handle'], $src, $deps, $version, $media );
		}

	}

	/**
	 * Register styles for block.
	 *
	 * @since  1.0
	 * @access public
	 *
	 * @return array
	 */
	public function styles() {

		$styles = array(
			array(
				'handle'  => 'pods_gutenberg',
				'src'     => PODS_GUTENBERG_URL . 'css/block.css',
				'deps'    => array( 'wp-edit-blocks' ),
				'version' => filemtime( PODS_GUTENBERG_DIR . 'css/block.css' ),
			),
		);

		foreach ( self::$_blocks as $block ) {
			$block_styles = $block->styles();

			foreach ( $block_styles as $style ) {
				$styles[] = $style;
			}
		}

		return $styles;

	}

}

new Pods_Blocks();

// Load all the block files automatically.
foreach ( glob( plugin_dir_path( __FILE__ ) . 'blocks/class-pods-block-*.php' ) as $filename ) {
	require_once $filename;
}
