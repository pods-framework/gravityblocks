<?php

require_once 'class-gf-block-mailinglist.php';

class GF_Block_MailChimp extends GF_Block_MailingList {

	/**
	 * Contains an instance of this block, if available.
	 *
	 * @since  1.0-beta-3
	 * @access private
	 * @var    GF_Block $_instance If available, contains an instance of this block.
	 */
	private static $_instance = null;

	/**
	 * Block type.
	 *
	 * @var string
	 */
	public $type = 'gravityforms/mailchimp';

	/**
	 * Get instance of this class.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 * @static
	 *
	 * @return GF_Block
	 */
	public static function get_instance() {

		if ( null === self::$_instance ) {
			self::$_instance = new self;
		}

		return self::$_instance;

	}

	/**
	 * Register authentication route.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 */
	public function init() {

		parent::init();

		add_action( 'rest_api_init', array( $this, 'register_authentication_route' ) );

	}




	// # SCRIPT / STYLES -----------------------------------------------------------------------------------------------

	/**
	 * Register scripts for block.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 *
	 * @uses   GFAddOn::get_base_path()
	 * @uses   GFAddOn::get_base_url()
	 *
	 * @return array
	 */
	public function scripts() {

		return array(
			array(
				'handle'   => 'gform_editor_block_mailchimp',
				'src'      => gf_gutenberg()->get_base_url() . '/js/blocks/mailchimp.min.js',
				'deps'     => array( 'wp-blocks', 'wp-element' ),
				'version'  => filemtime( gf_gutenberg()->get_base_path() . '/js/blocks/mailchimp.min.js' ),
				'callback' => array( $this, 'localize_script' ),
			),
		);

	}

	/**
	 * Localize core block script.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 *
	 * @param array $script Script arguments.
	 */
	public function localize_script( $script = array() ) {

		wp_localize_script(
			$script['handle'],
			'gform_mailchimp',
			array(
				'authenticated'   => gf_mailchimp()->initialize_api(),
				'plugin_settings' => admin_url( 'admin.php?page=gf_settings&subview=' . gf_mailchimp()->get_slug() ),
				'lists'           => $this->get_lists(),
				'icon'            => gf_gutenberg()->get_base_url() . '/images/blocks/mailchimp/icon.svg',
				'placeholder'     => gf_gutenberg()->get_base_url() . '/images/blocks/mailchimp/placeholder.svg',
			)
		);

	}

	/**
	 * Register styles for block.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 *
	 * @uses   GFAddOn::get_base_path()
	 * @uses   GFAddOn::get_base_url()
	 * @uses   GFCommon::get_base_url()
	 *
	 * @return array
	 */
	public function styles() {

		$min = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG || isset( $_GET['gform_debug'] ) ? '' : '.min';

		return array(
			array(
				'handle' => 'gforms_formsmain_css',
				'src'    => GFCommon::get_base_url() . '/css/formsmain' . $min . '.css',
			),
			array(
				'handle'  => 'gform_editor_block_mailchimp',
				'src'     => gf_gutenberg()->get_base_url() . '/css/blocks/mailchimp.min.css',
				'deps'    => array( 'gforms_formsmain_css' ),
				'version' => filemtime( gf_gutenberg()->get_base_path() . '/css/blocks/mailchimp.min.css' ),
			),
		);

	}





	// # BLOCK RENDER --------------------------------------------------------------------------------------------------

	/**
	 * Display block contents on frontend.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 *
	 * @param array $attributes Block attributes.
	 *
	 * @uses   GF_Block_MailChimp::get_form_object()
	 * @uses   GFCommon::get_base_path()
	 * @uses   GFCommon::get_browser_class()
	 * @uses   GFFormDisplay::enqueue_form_scripts()
	 * @uses   GFFormDisplay::get_field()
	 * @uses   GFFormDisplay::gform_footer()
	 * @uses   GFFormsModel::get_field_value()
	 *
	 * @return string|null
	 */
	public function render_block( $attributes = array() ) {

		// If no list was selected or API cannot be initialized, return.
		if ( ! rgar( $attributes, 'list' ) || ! gf_mailchimp()->initialize_api() ) {
			return null;
		}

		return parent::render_block( $attributes );

	}

	/**
	 * Get feed object for subscribing user.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 *
	 * @param array $attributes Block attributes.
	 * @param array $form       Form object.
	 *
	 * @return array
	 */
	public function get_feed_object( $attributes = array(), $form = array() ) {

		return array(
			'id'         => 1,
			'form_id'    => $form['id'],
			'is_active'  => 1,
			'feed_order' => 0,
			'meta'       => array(
				'feedName'           => $form['title'],
				'mailchimpList'      => $attributes['list'],
				'mappedFields_EMAIL' => '2',
				'mappedFields_FNAME' => false === rgar( $attributes, 'nameField' ) ? '' : '1.3',
				'mappedFields_LNAME' => false === rgar( $attributes, 'nameField' ) ? '' : '1.6',
				'double_optin'       => false === rgar( $attributes, 'doubleOptIn' ) ? '0' : '1',
			),
		);

	}

	/**
	 * Dispatch feed object to feed processor.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 *
	 * @param array $feed  Feed object.
	 * @param array $entry Entry object.
	 * @param array $form  Form object.
	 *
	 * @return array
	 */
	public function process_feed( $feed = array(), $entry = array(), $form = array() ) {

		return gf_mailchimp()->process_feed( $feed, $entry, $form );

	}





	// # AUTHENTICATION ------------------------------------------------------------------------------------------------

	/**
	 * Register REST API route to authenticate with MailChimp.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 *
	 * @uses   GF_Block_MailChimp::authentication_response()
	 */
	public function register_authentication_route() {

		register_rest_route( 'gf/v2', '/block/mailchimp/auth', array(
			array(
				'methods'  => WP_REST_Server::READABLE,
				'callback' => array( $this, 'authentication_response' ),
				'args'     => array(
					'apiKey' => array(
						'description' => __( 'The MailChimp API key.' ),
						'type'        => 'string',
						'required'    => true,
					),
				),
			),
		) );

	}

	/**
	 * Authenticate with MailChimp.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @uses   GFAddOn::get_plugin_settings()
	 * @uses   GFAddOn::update_plugin_settings()
	 * @uses   GF_Block_MailChimp::get_lists()
	 * @uses   GFMailChimp::initialize_api()
	 * @uses   WP_REST_Request::get_param()
	 */
	public function authentication_response( $request ) {

		// Get API key.
		$api_key = $request->get_param( 'apiKey' );

		// Get MailChimp plugin settings.
		$settings = gf_mailchimp()->get_plugin_settings();

		// Update API key and save.
		$settings['apiKey'] = $api_key;
		gf_mailchimp()->update_plugin_settings( $settings );

		// Check if MailChimp was authenticated.
		$authenticated = gf_mailchimp()->initialize_api();

		// If MailChimp could not be authenticated, return.
		if ( ! $authenticated ) {
			wp_send_json_error();
		}

		// Get lists.
		$lists = $this->get_lists();

		wp_send_json_success( array( 'lists' => $lists ) );

	}





	// # HELPER METHODS ------------------------------------------------------------------------------------------------

	/**
	 * Get MailChimp lists for block.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 *
	 * @return array
	 */
	public function get_lists() {

		// If MailChimp is not installed, return.
		if ( ! function_exists( 'gf_mailchimp' ) ) {
			return array();
		}

		// If MailChimp API is not initialized, return.
		if ( ! gf_mailchimp()->initialize_api() ) {
			return array();
		}

		try {

			// Get MailChimp lists.
			$mc_lists = gf_mailchimp()->api->get_lists( array( 'start' => 0, 'limit' => 100 ) );

		} catch ( Exception $e ) {

			// Log that we could not get MailChimp lists.
			gf_gutenberg()->log_error( __METHOD__ . '(): Unable to get MailChimp lists; ' . $e->getMessage() );

			return array();

		}

		// Initialize lists array.
		$lists = array();

		// Loop through MailChimp lists.
		foreach ( $mc_lists['lists'] as $mc_list ) {

			// Add list to return array.
			$lists[] = array(
				'label' => esc_html( $mc_list['name'] ),
				'value' => esc_attr( $mc_list['id'] ),
			);

		}

		return $lists;

	}

}

try {

	// Register block.
	if ( function_exists( 'gf_mailchimp' ) && version_compare( gf_mailchimp()->get_version(), '4.2.6', '>=' ) ) {
		GF_Blocks::register( GF_Block_MailChimp::get_instance() );
	}

} catch ( Exception $e ) {

	// Log that block could not be registered.
	GFCommon::log_debug( 'Unable to register block; ' . $e->getMessage() );

}
