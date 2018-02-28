<?php

class Pods_Block_Core extends Pods_Block {

	/**
	 * Contains an instance of this block, if available.
	 *
	 * @since  1.0
	 * @access private
	 * @var    Pods_Block $_instance If available, contains an instance of this block.
	 */
	private static $_instance = null;

	/**
	 * Block type.
	 *
	 * @var string
	 */
	public $type = 'pods/block';

	/**
	 * Get instance of this class.
	 *
	 * @since  1.0
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
				'handle'   => 'pods_editor_block_core',
				'src'      => PODS_GUTENBERG_URL . 'js/blocks/core.min.js',
				'deps'     => array( 'wp-blocks', 'wp-element' ),
				'version'  => filemtime( PODS_GUTENBERG_DIR . 'js/blocks/core.min.js' ),
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

		wp_localize_script( $script['handle'], 'pods', array(
			'forms'              => pods_gutenberg()->get_forms(),
			'conditionalOptions' => pods_gutenberg()->get_conditional_options(),
			'icon'               => PODS_GUTENBERG_URL . 'images/blocks/core/icon.svg',
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

		return array(
			array(
				'handle'  => 'pods_editor_block_core',
				'src'     => PODS_GUTENBERG_URL . 'css/block.css',
				'deps'    => array( 'wp-edit-blocks' ),
				'version' => filemtime( PODS_GUTENBERG_DIR . 'css/block.css' ),
			),
		);

	}

	// # BLOCK RENDER -------------------------------------------------------------------------------------------------

	/**
	 * Display block contents on frontend.
	 *
	 * @since  1.0-beta-3
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
		$ajax        = isset( $attributes['ajax'] ) ? $attributes['ajax'] : false;
		$tabindex    = isset( $attributes['tabindex'] ) ? $attributes['tabindex'] : 0;
		$logic       = isset( $attributes['conditionalLogic'] ) ? $attributes['conditionalLogic'] : array();

		// If form ID was not provided or form does not exist, return.
		if ( ! $form_id || ( $form_id && ! PodsAPI::get_form( $form_id ) ) || ! $this->can_view_block( $logic ) ) {
			return '';
		}

		return pods_form( $form_id, $title, $description, false, null, $ajax, $tabindex, false );

	}

	// # BLOCK PREVIEW -------------------------------------------------------------------------------------------------

	/**
	 * Display block contents in block editor.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 *
	 * @param array $attributes Block attributes.
	 *
	 * @return string
	 */
	public function preview_block( $attributes = array() ) {

		ob_start();
		require_once PODS_GUTENBERG_DIR . 'includes/preview.php';
		$html = ob_get_contents();
		ob_end_clean();

		return $html;

	}

}

try {
	// Register block.
	Pods_Blocks::register( Pods_Block_Core::get_instance() );
} catch ( Exception $e ) {
	// Log that block could not be registered.
	pods_error( 'Unable to register block; ' . $e->getMessage() );
}
