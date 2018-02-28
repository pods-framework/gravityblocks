<?php

// Determine if we're loading minified scripts.
$min = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" <?php language_attributes(); ?>>
<head>
	<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
	<meta http-equiv="Imagetoolbar" content="No" />
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><?php esc_html_e( 'Pods Preview', 'pods-gutenberg-blocks' ); ?></title>
	<link rel="stylesheet" href="<?php echo esc_url( PODS_GUTENBERG_URL . 'css/preview.css' ); ?>" />
	<?php wp_print_head_scripts(); ?>
</head>
<body data-resizable-iframe-connected="data-resizable-iframe-connected">
<?php

if ( ! empty( $attributes['form'] ) ) {
?>
	<p<img src="<?php echo esc_url( PODS_GUTENBERG_URL . 'images/blocks/core/icon.svg' ); ?>" alt="Pods Form" width="200" /></p>
	<p><em>Form embed</em></p>
<?php
} else {
	/**
	 * @var $block Pods_Block
	 */
	$block->render_block( $attributes );
}

wp_print_footer_scripts();
?>

<script type="text/javascript">
	(function () {
		var observer;

		if ( !window.MutationObserver || !document.body || !window.parent ) {
			return;
		}

		function sendResize() {
			var clientBoundingRect = document.body.getBoundingClientRect();
			window.parent.postMessage( {
				action : 'resize',
				width  : clientBoundingRect.width,
				height : clientBoundingRect.height,
			}, '*' );
		}

		observer = new MutationObserver( sendResize );
		observer.observe( document.body, {
			attributes            : true,
			attributeOldValue     : false,
			characterData         : true,
			characterDataOldValue : false,
			childList             : true,
			subtree               : true
		} );

		window.addEventListener( 'load', sendResize, true );

		document.body.style.position = 'absolute';
		document.body.setAttribute( 'data-resizable-iframe-connected', '' );

		sendResize();
	})();
</script>
</body>
</html>
