<?php

class Pods_Block {

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
	public $type = '';

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

		if ( null === static::$_instance ) {
			$class = get_called_class();

			static::$_instance = new $class;
		}

		return static::$_instance;

	}

	/**
	 * Register block type.
	 * Enqueue editor assets.
	 *
	 * @since  1.0
	 * @access public
	 *
	 * @uses   Pods_Block::register_block_type()
	 */
	public function init() {

		$this->register_block_type();

	}

	// # BLOCK REGISTRATION --------------------------------------------------------------------------------------------

	/**
	 * Get block type.
	 *
	 * @since  1.0
	 * @access public
	 *
	 * @return string
	 */
	public function get_type() {

		return $this->type;

	}

	/**
	 * Get REST API preview URL.
	 *
	 * @since  1.0
	 * @access public
	 *
	 * @return string
	 */
	public function get_rest_preview_url() {

		$type_path = str_replace( 'pods/', '', $this->type );

		return sprintf( 'pods/v2/block/%s/preview', $type_path );

	}

	/**
	 * Register block with WordPress.
	 *
	 * @since  1.0
	 * @access public
	 */
	public function register_block_type() {

		register_block_type( $this->get_type(), array(
			'render_callback' => array( $this, 'render_block' ),
		) );

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

		return array();

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

		return array();

	}

	// # BLOCK RENDER -------------------------------------------------------------------------------------------------

	/**
	 * Display block contents on frontend.
	 *
	 * @since  1.0
	 * @access public
	 *
	 * @param array $attributes Block attributes.
	 *
	 * @return string
	 */
	public function render_block( $attributes = array() ) {

		$content = null;

		if ( ! empty( $attributes['content'] ) ) {
			$content = $attributes['content'];
		}

		return pods_shortcode( $attributes, $content );

	}

	// # BLOCK PREVIEW -------------------------------------------------------------------------------------------------

	/**
	 * Display block contents in block editor.
	 *
	 * @since  1.0
	 * @access public
	 *
	 * @param array $attributes Block attributes.
	 *
	 * @return string
	 */
	public function preview_block( $attributes = array() ) {

		$block = $this;

		ob_start();
		require_once PODS_GUTENBERG_DIR . 'includes/preview.php';
		$html = ob_get_contents();
		ob_end_clean();

		return $html;

	}

	// # CONDITIONAL LOGIC ---------------------------------------------------------------------------------------------

	/**
	 * Determine if user can view block.
	 *
	 * @since  1.0
	 * @access public
	 *
	 * @param array $logic Conditional logic.
	 *
	 * @return bool
	 */
	public function can_view_block( $logic ) {

		// @todo Add get_local_timestamp()
		// @todo Add matches_operation()

		if ( ! isset( $logic['enabled'] ) || ( isset( $logic['rules'] ) && empty( $logic['rules'] ) ) ) {
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
					if ( ! rgblank( $rule['value'] ) && pods_gutenberg()->matches_operation( strtotime( $rule['value'] ), pods_gutenberg()->get_local_timestamp(), $rule['operator'] ) ) {
						$match_count ++;
					}

					break;
				case 'user':
					// Handle logged in.
					if ( 'logged-in' === $rule['value'] ) {
						if ( ( is_user_logged_in() && 'is' === $rule['operator'] ) || ( ! is_user_logged_in() && 'isnot' === $rule['operator'] ) ) {
							$match_count ++;
						}
					} elseif ( 'logged-out' === $rule['value'] ) {
						if ( ( ! is_user_logged_in() && 'is' === $rule['operator'] ) || ( is_user_logged_in() && 'isnot' === $rule['operator'] ) ) {
							$match_count ++;
						}
					} else {
						if ( ( in_array( $rule['value'], $user->roles, true ) && 'is' === $rule['operator'] ) || ( ! in_array( $rule['value'], $user->roles, true ) && 'isnot' === $rule['operator'] ) ) {
							$match_count ++;
						}
					}

					break;
			}
		}

		$result = ( 'all' === $logic['logicType'] && count( $logic['rules'] ) === $match_count ) || ( 'any' === $logic['logicType'] && 0 < $match_count );

		return 'hide' === $logic['actionType'] ? ! $result : $result;

	}

	/**
	 * Get REST API parameters for preview.
	 *
	 * @since  1.0
	 * @access public
	 *
	 * @return array
	 */
	public function get_rest_api_params() {

		return array();

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

		return array(
			'type'             => $this->get_type(),
			'rest_preview_url' => $this->get_rest_preview_url(),
			'title'            => '',
			'description'      => '',
			'category'         => 'embed',
			'supports'         => array(
				'customClassName' => false,
				'className'       => false,
				'html'            => false,
			),
			'attributes'       => $this->get_block_config_attributes(),
		);

	}

	/**
	 * Get Gutenberg Block JS config attributes.
	 *
	 * @since  1.0
	 * @access public
	 *
	 * @return array
	 */
	public function get_block_config_attributes() {

		$acceptable_args = array(
			'type',
			'default',
		);

		$rest_api_params = $this->get_rest_api_params();

		$attributes = array();

		foreach ( $rest_api_params as $param => $args ) {
			$attribute      = $param;
			$attribute_args = array();

			foreach ( $acceptable_args as $acceptable_arg ) {
				if ( isset( $args[ $acceptable_arg ] ) ) {
					$attribute_args[ $acceptable_arg ] = $args[ $acceptable_arg ];
				}
			}

			$attributes[ $attribute ] = $attribute_args;
		}

		$attributes['conditional_logic'] = array(
			'type'    => 'object',
			'default' => array(
				'enabled'    => false,
				'actionType' => 'show',
				'logicType'  => 'all',
				'rules'      => array(),
			),
		);

		$attributes['show_preview'] = array(
			'type'    => 'bool',
			'default' => true,
		);

		return $attributes;

	}

}
