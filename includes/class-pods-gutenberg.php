<?php

// If Pods cannot be found, exit.
if ( ! defined( 'PODS_VERSION' ) ) {
	die();
}

/**
 * Gutenberg integration.
 */
class Pods_Gutenberg {

	/**
	 * Contains an instance of this class, if available.
	 *
	 * @since  1.0
	 * @access private
	 * @var    Pods_Gutenberg $_instance If available, contains an instance of this class.
	 */
	private static $_instance = null;

	/**
	 * Defines the version of the Gutenberg Add-On.
	 *
	 * @since  1.0
	 * @access protected
	 * @var    string $_version Contains the version, defined in gutenberg.php
	 */
	protected $_version = PODS_GUTENBERG_VERSION;

	/**
	 * Defines the minimum Pods version required.
	 *
	 * @since  1.0
	 * @access protected
	 * @var    string $_min_pods_version The minimum version required.
	 */
	protected $_min_pods_version = '2.7';

	/**
	 * Defines the plugin slug.
	 *
	 * @since  1.0
	 * @access protected
	 * @var    string $_slug The slug used for this plugin.
	 */
	protected $_slug = 'pods-gutenberg-blocks';

	/**
	 * Defines the main plugin file.
	 *
	 * @since  1.0
	 * @access protected
	 * @var    string $_path The path to the main plugin file, relative to the plugins folder.
	 */
	protected $_path = 'pods-gutenberg-blocks/pods-gutenberg-blocks.php';

	/**
	 * Defines the full path to this class file.
	 *
	 * @since  1.0
	 * @access protected
	 * @var    string $_full_path The full path.
	 */
	protected $_full_path = __FILE__;

	/**
	 * Defines the URL where this Add-On can be found.
	 *
	 * @since  1.0
	 * @access protected
	 * @var    string The URL of the Add-On.
	 */
	protected $_url = 'https://pods.io';

	/**
	 * Defines the title of this Add-On.
	 *
	 * @since  1.0
	 * @access protected
	 * @var    string $_title The title of the Add-On.
	 */
	protected $_title = 'Pods Gutenberg Add-On';

	/**
	 * Defines the short title of the Add-On.
	 *
	 * @since  1.0
	 * @access protected
	 * @var    string $_short_title The short title.
	 */
	protected $_short_title = 'Gutenberg';

	/**
	 * Get instance of this class.
	 *
	 * @since  1.0
	 * @access public
	 * @static
	 *
	 * @return Pods_Gutenberg
	 */
	public static function get_instance() {

		if ( null === self::$_instance ) {
			self::$_instance = new self;
		}

		return self::$_instance;

	}

	// # HELPER METHODS ------------------------------------------------------------------------------------------------

	/**
	 * Get forms for block control.
	 *
	 * @since  1.0
	 * @access public
	 *
	 * @uses   PodsAPI::get_forms()
	 *
	 * @return array
	 */
	public function get_forms() {

		// Initialize options array.
		$options = array(
			array(
				'label' => esc_html__( 'Select a Form', 'pods-gutenberg-blocks' ),
				'value' => '',
			),
		);

		// Get forms.
		$forms = PodsAPI::get_forms();

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

	/**
	 * Get options for the conditional logic drop downs.
	 *
	 * @since  1.0
	 * @access public
	 *
	 * @uses   Pods_Gutenberg::get_roles()
	 *
	 * @return array
	 */
	public function get_conditional_options() {

		return array(
			array(
				'key'       => array(
					'label' => esc_html__( 'User', 'pods-gutenberg-blocks' ),
					'value' => 'user',
				),
				'operators' => array(
					array(
						'label' => 'is',
						'value' => 'is',
					),
					array(
						'label' => 'is not',
						'value' => 'isnot',
					),
				),
				'value'     => array(
					'type'    => 'select',
					'choices' => array(
						array(
							'label' => esc_html__( 'Logged In', 'pods-gutenberg-blocks' ),
							'value' => 'logged-in',
						),
						array(
							'label' => esc_html__( 'Logged Out', 'pods-gutenberg-blocks' ),
							'value' => 'logged-out',
						),
						array(
							'label'   => esc_html__( 'Roles', 'pods-gutenberg-blocks' ),
							'choices' => $this->get_roles(),
						),
					),
				),
			),
			array(
				'key'       => array(
					'label' => esc_html__( 'Date', 'pods-gutenberg-blocks' ),
					'value' => 'date',
				),
				'operators' => array(
					array(
						'label' => 'is before',
						'value' => 'greater_than',
					),
					array(
						'label' => 'is after',
						'value' => 'less_than',
					),
				),
				'value'     => array(
					'type' => 'date',
				),
			),
		);

	}

	/**
	 * Get available roles for block control.
	 *
	 * @since  1.0
	 * @access public
	 *
	 * @return array
	 */
	public function get_roles() {

		// Load needed function file.
		if ( ! function_exists( 'get_editable_roles' ) ) {
			require_once( ABSPATH . '/wp-admin/includes/user.php' );
		}

		// Initialize roles array.
		$roles = array();

		// Loop through roles.
		foreach ( get_editable_roles() as $role_name => $role ) {

			// Add role as option.
			$roles[] = array(
				'label' => $role['name'],
				'value' => $role_name,
			);

		}

		return $roles;

	}

}
