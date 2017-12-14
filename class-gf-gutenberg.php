<?php

// If Gravity Forms cannot be found, exit.
if ( ! class_exists( 'GFForms' ) ) {
	die();
}

// Load Add-On Framework.
GFForms::include_addon_framework();

/**
 * Gutenberg integration using the Add-On Framework.
 *
 * @see GFAddOn
 */
class GF_Gutenberg extends GFAddOn {

	/**
	 * Contains an instance of this class, if available.
	 *
	 * @since  1.0
	 * @access private
	 * @var    GF_Gutenberg $_instance If available, contains an instance of this class.
	 */
	private static $_instance = null;

	/**
	 * Defines the version of the Gutenberg Add-On.
	 *
	 * @since  1.0
	 * @access protected
	 * @var    string $_version Contains the version, defined in gutenberg.php
	 */
	protected $_version = GF_GUTENBERG_VERSION;

	/**
	 * Defines the plugin slug.
	 *
	 * @since  1.0
	 * @access protected
	 * @var    string $_slug The slug used for this plugin.
	 */
	protected $_slug = 'gravityformsgutenberg';

	/**
	 * Defines the main plugin file.
	 *
	 * @since  1.0
	 * @access protected
	 * @var    string $_path The path to the main plugin file, relative to the plugins folder.
	 */
	protected $_path = 'gravityformsgutenberg/gutenberg.php';

	/**
	 * Defines the full path to this class file.
	 *
	 * @since  1.0
	 * @access protected
	 * @var    string $_full_path The full path.
	 */
	protected $_full_path = __FILE__;

	/**
	 * Get instance of this class.
	 *
	 * @since  1.0
	 * @access public
	 * @static
	 *
	 * @return GF_Gutenberg
	 */
	public static function get_instance() {

		if ( null === self::$_instance ) {
			self::$_instance = new self;
		}

		return self::$_instance;

	}

	/**
	 * Register needed hooks.
	 *
	 * @since  1.0-dev-1
	 * @access public
	 */
	public function init() {

		parent::init();

		// Register block.
		register_block_type( 'gravityforms/block', array(
			'render_callback' => array( $this, 'render_block' ),
		) );

		// Enqueue scripts.
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_assets' ) );

		// Register preview Gutenberg block route.
		add_action( 'rest_api_init', array( $this, 'register_preview_route' ) );

	}





	// # BLOCK ---------------------------------------------------------------------------------------------------------

	/**
	 * Enqueue assets needed for Gutenberg block.
	 *
	 * @since  1.0-dev-1
	 * @access public
	 *
	 * @uses   GFAddOn::get_base_path()
	 * @uses   GFAddOn::get_base_url()
	 * @uses   GF_Gutenberg::get_forms()
	 */
	public function enqueue_block_assets() {

		// Enqueue script.
		wp_enqueue_script(
			'gform_gutenberg_block',
			$this->get_base_url() . '/js/block.min.js',
			array( 'wp-blocks', 'wp-element' ),
			filemtime( $this->get_base_path() . '/js/block.min.js' )
		);

		// Prepare JS variables.
		wp_localize_script(
			'gform_gutenberg_block',
			'gform',
			array( 'forms' => $this->get_forms() )
		);

	}

	/**
	 * Display block contents on frontend.
	 *
	 * @since  1.0-dev-1
	 * @access public
	 *
	 * @param array $attributes Block attributes.
	 *
	 * @return string
	 */
	public function render_block( $attributes = array() ) {

		// Prepare variables.
		$form_id     = rgar( $attributes, 'formId' ) ? $attributes['formId'] : false;
		$title       = isset( $attributes['title'] ) ? $attributes['title'] : true;
		$description = isset( $attributes['description'] ) ? $attributes['description'] : true;
		$ajax        = isset( $attributes['ajax'] ) ? $attributes['ajax'] : true;

		// If form ID was not provided or form does not exist, return.
		if ( ! $form_id || ( $form_id && ! GFAPI::get_form( $form_id ) ) ) {
			return '';
		}

		return gravity_form( $form_id, $title, $description, false, null, $ajax, 1, false );

	}





	// # BLOCK PREVIEW -------------------------------------------------------------------------------------------------

	/**
	 * Register REST API route to preview Gutenberg block.
	 *
	 * @since  1.0-dev-2
	 * @access public
	 *
	 * @uses   GF_Gutenberg::preview_block()
	 */
	public function register_preview_route() {

		register_rest_route( 'gf/v2', '/block/preview', array(
			array(
				'methods'  => WP_REST_Server::READABLE,
				'callback' => array( $this, 'preview_block' ),
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
	 * Prepare form HTML for Gutenberg block preview.
	 *
	 * @since  1.0-dev-2
	 * @access public
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @uses   GF_Gutenberg::render_block()
	 * @uses   WP_REST_Request::get_params()
	 */
	public function preview_block( $request ) {

		global $wp_scripts;

		// Get request arguments.
		$args = $request->get_params();

		// Get form HTML.
		$html = $this->render_block( $args );

		if ( $html ) {
			wp_send_json_success( array( 'html' => trim( $html ), 'scripts' => $wp_scripts ) );
		} else {
			wp_send_json_error();
		}

	}





	// # HELPER METHODS ------------------------------------------------------------------------------------------------

	/**
	 * Get forms for Gutenberg block control.
	 *
	 * @since  1.0-dev-1
	 * @access public
	 *
	 * @uses   GFAPI::get_forms()
	 *
	 * @return array
	 */
	private function get_forms() {

		// Initialize options array.
		$options = array(
			array(
				'label' => esc_html__( 'Select a Form', 'gravityforms' ),
				'value' => '',
			),
		);

		// Get forms.
		$forms = GFAPI::get_forms();

		// Loop through forms.
		foreach ( $forms as $form ) {

			// Add form as option.
			$options[] = array(
				'label' => $form['title'],
				'value' => $form['id'],
			);

		}

		return $options;

	}

}
