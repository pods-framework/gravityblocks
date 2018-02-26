<?php

class GF_Block {

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
	public $type = '';

	/**
	 * Register block type.
	 * Enqueue editor assets.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 *
	 * @uses   GF_Block::register_block_type()
	 */
	public function init() {

		$this->register_block_type();

		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_scripts' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_styles' ) );

	}





	// # BLOCK REGISTRATION --------------------------------------------------------------------------------------------

	/**
	 * Get block type.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 *
	 * @return string
	 */
	public function get_type() {

		return $this->type;

	}

	/**
	 * Register block with WordPress.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 */
	public function register_block_type() {

		register_block_type( $this->get_type(), array(
			'render_callback' => array( $this, 'render_block' ),
		) );

	}





	// # SCRIPT ENQUEUEING ---------------------------------------------------------------------------------------------

	/**
	 * Enqueue block scripts.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 *
	 * @uses   GF_Block::scripts()
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
			if ( rgar( $script, 'strings' ) ) {
				wp_localize_script( $script['handle'], $script['handle'] . '_strings', $script['strings'] );
			}

			// Run script callback.
			if ( rgar( $script, 'callback' ) && is_callable( $script['callback'] ) ) {
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
	 *                'stringKey1' => __( 'The string', 'gravityforms' ),
	 *                'stringKey2' => __( 'Another string.', 'gravityforms' )
	 *            )
	 *        )
	 *    );
	 *
	 * </code>
	 * </pre>
	 *
	 * @since  1.0-beta-3
	 * @access public
	 *
	 * @return array
	 */
	public function scripts() {

		return array();

	}





	// # STYLE ENQUEUEING ----------------------------------------------------------------------------------------------

	/**
	 * Enqueue block styles.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 *
	 * @uses   GF_Block::styles()
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
	 * Override this function to provide a list of styles to be enqueued.
	 * See scripts() for an example of the format expected to be returned.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 *
	 * @return array
	 */
	public function styles() {

		return array();

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

		return '';

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

		return '';

	}





	// # CONDITIONAL LOGIC ---------------------------------------------------------------------------------------------

	/**
	 * Determine if user can view block.
	 *
	 * @since  1.0-beta-3
	 * @access public
	 *
	 * @param array $logic Conditional logic.
	 *
	 * @uses   GFCommon::get_local_timestamp()
	 * @uses   GFFormsModel::matches_operation()
	 *
	 * @return bool
	 */
	public function can_view_block( $logic ) {

		if ( ! rgar( $logic, 'enabled' ) || ( isset( $logic['rules'] ) && empty( $logic['rules'] ) ) ) {
			return true;
		}

		// Get current user.
		$user = wp_get_current_user();

		// Initialize rule match count.
		$match_count = 0;

		// Loop through rules.
		foreach ( $logic['rules'] as $rule ) {

			switch ( $rule['key'] ) {

				case 'date':

					if ( ! rgblank( $rule['value'] ) && GFFormsModel::matches_operation( strtotime( $rule['value'] ), GFCommon::get_local_timestamp(), $rule['operator'] ) ) {
						$match_count++;
					}

					break;

				case 'user':

					// Handle logged in.
					if ( 'logged-in' === $rule['value'] ) {

						if ( ( is_user_logged_in() && $rule['operator'] === 'is' ) || ( ! is_user_logged_in() && $rule['operator'] === 'isnot' ) ) {
							$match_count++;
						}

					} else if ( 'logged-out' === $rule['value'] ) {

						if ( ( ! is_user_logged_in() && $rule['operator'] === 'is' ) || ( is_user_logged_in() && $rule['operator'] === 'isnot' ) ) {
							$match_count++;
						}

					} else {

						if ( ( in_array( $rule['value'], $user->roles ) && $rule['operator'] === 'is' ) || ( ! in_array( $rule['value'], $user->roles ) && $rule['operator'] === 'isnot' ) ) {
							$match_count++;
						}

					}

					break;

			}

		}

		$result = ( 'all' === $logic['logicType'] && $match_count === count( $logic['rules'] ) ) || ( 'any' === $logic['logicType'] && $match_count > 0 );

		return 'hide' === $logic['actionType'] ? ! $result : $result;

	}

}
