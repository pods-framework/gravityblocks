<?php

// Prepare variables.
$form_id     = rgar( $attributes, 'formId' ) ? $attributes['formId'] : false;
$title       = isset( $attributes['title'] ) ? $attributes['title'] : true;
$description = isset( $attributes['description'] ) ? $attributes['description'] : true;

// Get form object.
$form = array();

// Determine if we're loading minified scripts.
$min = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) || isset( $_GET['pods_debug'] ) ? '' : '.min';

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" <?php language_attributes(); ?>>
<head>
	<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
	<meta http-equiv="Imagetoolbar" content="No" />
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><?php esc_html_e( 'Pods Preview', 'pods-gutenberg-blocks' ) ?></title>
	<link rel="stylesheet" href="<?php echo esc_url( PODS_GUTENBERG_URL . 'css/preview.css' ); ?>" />
	<?php
	wp_print_head_scripts();

	$styles = apply_filters( 'pods_preview_styles', array(), $form );
	if ( ! empty( $styles ) ) {
		wp_print_styles( $styles );
	}
	?>
</head>
<body data-resizable-iframe-connected="data-resizable-iframe-connected">
<?php

// @todo RENDER whatever we need here
// echo PodsForms::get_form( $form_id, $title, $description, true );

wp_print_footer_scripts();
do_action( 'pods_preview_footer', $form_id );

if ( is_rtl() ) {
	?>
	<link rel='stylesheet' href='<?php echo esc_url( PODS_GUTENBERG_URL . 'css/rtl' . $min . '.css' ); ?>' type='text/css' />
<?php } ?>

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