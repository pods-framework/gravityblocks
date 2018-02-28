<?php
/**
 * Plugin Name: Pods Gutenberg Add-On
 * Plugin URI: https://pods.io
 * Description: Adds Pods blocks to the Gutenberg post editor.
 * Version: 1.0-beta-1
 * Author: Pods Framework Team, rocketgenius
 * Author URI: https://pods.io
 * License: GPL-2.0+
 * Text Domain: pods-gutenberg-blocks
 * Domain Path: /languages
 *
 * ------------------------------------------------------------------------
 * Copyright 2012-2016 Rocketgenius Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 **/

define( 'PODS_GUTENBERG_VERSION', '1.0-beta-1' );

define( 'PODS_GUTENBERG_SLUG', plugin_basename( __FILE__ ) );
define( 'PODS_GUTENBERG_URL', plugin_dir_url( __FILE__ ) );
define( 'PODS_GUTENBERG_DIR', plugin_dir_path( __FILE__ ) );

require_once PODS_GUTENBERG_DIR . 'includes/class-pods-gutenberg-bootstrap.php';

add_action( 'init', array( 'Pods_Gutenberg_Bootstrap', 'load_blocks' ) );

/**
 * Returns an instance of the Pods_Gutenberg class
 *
 * @see    Pods_Gutenberg::get_instance()
 * @return Pods_Gutenberg
 */
function pods_gutenberg() {

	return Pods_Gutenberg::get_instance();

}
