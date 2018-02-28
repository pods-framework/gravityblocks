<?php

require_once PODS_GUTENBERG_DIR . 'includes/blocks/class-pods-block-mailinglist.php';

class Pods_Block_MailChimp extends Pods_Block_MailingList {

	/**
	 * Contains an instance of this block, if available.
	 *
	 * @since  1.0-beta-3
	 * @access private
	 * @var    Pods_Block $_instance If available, contains an instance of this block.
	 */
	private static $_instance = null;

	/**
	 * Block type.
	 *
	 * @var string
	 */
	public $type = 'pods/mailchimp';

	/**
	 * Get instance of this class.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 * @static
	 *
	 * @return Pods_Block
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
	 * @return array
	 */
	public function scripts() {

		return array(
			array(
				'handle'   => 'pods_editor_block_mailchimp',
				'src'      => PODS_GUTENBERG_URL . 'js/blocks/mailchimp.min.js',
				'deps'     => array( 'wp-blocks', 'wp-element' ),
				'version'  => filemtime( PODS_GUTENBERG_DIR . 'js/blocks/mailchimp.min.js' ),
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

		wp_localize_script( $script['handle'], 'pods_mailchimp', array(
			'authenticated'   => pods_mailchimp()->initialize_api(),
			'plugin_settings' => admin_url( 'admin.php?page=pods_settings&subview=' . pods_mailchimp()->get_slug() ),
			'lists'           => $this->get_lists(),
			'icon'            => PODS_GUTENBERG_URL . 'images/blocks/mailchimp/icon.svg',
			'placeholder'     => PODS_GUTENBERG_URL . 'images/blocks/mailchimp/placeholder.svg',
		) );

	}

	/**
	 * Register styles for block.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 *
	 * @return array
	 */
	public function styles() {

		$min = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG || isset( $_GET['pods_debug'] ) ? '' : '.min';

		return array(
			array(
				'handle' => 'pods_formsmain_css',
				'src'    => PodsCommon::get_base_url() . '/css/formsmain' . $min . '.css',
			),
			array(
				'handle'  => 'pods_editor_block_mailchimp',
				'src'     => PODS_GUTENBERG_URL . 'css/blocks/mailchimp.min.css',
				'deps'    => array( 'pods_formsmain_css' ),
				'version' => filemtime( PODS_GUTENBERG_DIR . 'css/blocks/mailchimp.min.css' ),
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
	 * @uses   Pods_Block_MailChimp::get_form_object()
	 * @uses   PodsCommon::get_browser_class()
	 * @uses   PodsFormDisplay::enqueue_form_scripts()
	 * @uses   PodsFormDisplay::get_field()
	 * @uses   PodsFormDisplay::pods_footer()
	 * @uses   PodsFormsModel::get_field_value()
	 *
	 * @return string|null
	 */
	public function render_block( $attributes = array() ) {

		// If no list was selected or API cannot be initialized, return.
		if ( ! rgar( $attributes, 'list' ) || ! pods_mailchimp()->initialize_api() ) {
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

		return pods_mailchimp()->process_feed( $feed, $entry, $form );

	}

	// # AUTHENTICATION ------------------------------------------------------------------------------------------------

	/**
	 * Register REST API route to authenticate with MailChimp.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 *
	 * @uses   Pods_Block_MailChimp::authentication_response()
	 */
	public function register_authentication_route() {

		register_rest_route( 'pods/v2', '/block/mailchimp/auth', array(
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
	 * @uses   PodsAddOn::get_plugin_settings()
	 * @uses   PodsAddOn::update_plugin_settings()
	 * @uses   Pods_Block_MailChimp::get_lists()
	 * @uses   PodsMailChimp::initialize_api()
	 * @uses   WP_REST_Request::get_param()
	 */
	public function authentication_response( $request ) {

		// Get API key.
		$api_key = $request->get_param( 'apiKey' );

		// Get MailChimp plugin settings.
		$settings = pods_mailchimp()->get_plugin_settings();

		// Update API key and save.
		$settings['apiKey'] = $api_key;

		pods_mailchimp()->update_plugin_settings( $settings );

		// Check if MailChimp was authenticated.
		$authenticated = pods_mailchimp()->initialize_api();

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
		if ( ! function_exists( 'pods_mailchimp' ) ) {
			return array();
		}

		// If MailChimp API is not initialized, return.
		if ( ! pods_mailchimp()->initialize_api() ) {
			return array();
		}

		try {
			// Get MailChimp lists.
			$mc_lists = pods_mailchimp()->api->get_lists( array( 'start' => 0, 'limit' => 100 ) );
		} catch ( Exception $e ) {
			// Log that we could not get MailChimp lists.
			pods_error( __METHOD__ . '(): Unable to get MailChimp lists; ' . $e->getMessage() );

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
	if ( function_exists( 'pods_mailchimp' ) && version_compare( pods_mailchimp()->get_version(), '4.2.6', '>=' ) ) {
		Pods_Blocks::register( Pods_Block_MailChimp::get_instance() );
	}
} catch ( Exception $e ) {
	// Log that block could not be registered.
	pods_error( 'Unable to register block; ' . $e->getMessage() );
}
