var el = wp.element.createElement,
	registerBlockType = wp.blocks.registerBlockType;
var __ = wp.i18n.__;

registerBlockType( 'gravityforms/block', {

	title:      'Gravity Forms',
	icon:       'feedback',
	category:   'embed',
	attributes: {
		id:          {
			type: 'integer',
		},
		title:       {
			type:    'bool',
			default: true,
		},
		description: {
			type:    'bool',
			default: true,
		},
		ajax:        {
			type:    'bool',
			default: true,
		}
	},

	edit: function ( props ) {

		function onChangeForm( id ) {
			props.setAttributes( { id: id } );
		}

		function onChangeTitle( value ) {
			props.setAttributes( { title: !props.attributes.title } );
		}

		function onChangeDescription( value ) {
			props.setAttributes( { description: !props.attributes.description } );
		}

		function onChangeAjax( event ) {
			props.setAttributes( { ajax: !props.attributes.ajax } );
		}

		return [
			!!props.focus && el(
				wp.blocks.InspectorControls,
				{ key: 'inspector' },
				el(
					wp.blocks.InspectorControls.SelectControl,
					{
						label:    __( 'Select form', 'gravityforms' ),
						value:    props.attributes.id,
						options:  gform.forms,
						onChange: onChangeForm,
					}
				),
				el(
					wp.blocks.InspectorControls.ToggleControl,
					{
						label:    __( 'Display form title', 'gravityforms' ),
						checked:  props.attributes.title,
						onChange: onChangeTitle,
					}
				),
				el(
					wp.blocks.InspectorControls.ToggleControl,
					{
						label:    __( 'Display form description', 'gravityforms' ),
						checked:  props.attributes.description,
						onChange: onChangeDescription,
					}
				),
				el(
					wp.blocks.InspectorControls.ToggleControl,
					{
						label:    __( 'Enable AJAX', 'gravityforms' ),
						checked:  props.attributes.ajax,
						onChange: onChangeAjax,
					}
				)
			),
			el(
				'p',
				{},
				'Form preview.'
			)
		]

	},

	save: function () {
		return el( 'p', {}, 'Form preview.' );
	},

} );