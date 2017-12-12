var el = wp.element.createElement,
	__ = wp.i18n.__,
	registerBlockType = wp.blocks.registerBlockType,
	ToggleControl = wp.blocks.InspectorControls.ToggleControl;


registerBlockType( 'gravityforms/block', {

	title:      'Gravity Forms',
	icon:       'feedback',
	category:   'embed',
	supports:   {
		customClassName: false,
		className:       false
	},
	attributes: {
		id:          {
			type: 'integer'
		},
		title:       {
			type:    'bool',
			default: true
		},
		description: {
			type:    'bool',
			default: true
		},
		ajax:        {
			type:    'bool',
			default: true
		}
	},

	edit: function ( props ) {

		function onChangeFormPreview( event ) {
			props.setAttributes( { id: event.target.value } );
		}

		function onChangeForm( id ) {
			props.setAttributes( { id: id } );
		}

		function onChangeTitle() {
			props.setAttributes( { title: !props.attributes.title } );
		}

		function onChangeDescription() {
			props.setAttributes( { description: !props.attributes.description } );
		}

		function onChangeAjax() {
			props.setAttributes( { ajax: !props.attributes.ajax } );
		}

		var formOptions = [
			el(
				'option',
				{
					key:   'none',
					value: ''
				},
				__( 'Select a Form', 'gravityforms' )
			)
		];

		for ( var i = 0; i < gform.forms.length; i++ ) {
			formOptions.push(
				el(
					'option',
					{
						key:   gform.forms[ i ].value,
						value: gform.forms[ i ].value
					},
					gform.forms[ i ].label
				)
			);
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
						onChange: onChangeForm
					}
				),
				el(
					ToggleControl,
					{
						label:    __( 'Display form title', 'gravityforms' ),
						checked:  props.attributes.title,
						onChange: onChangeTitle
					}
				),
				el(
					ToggleControl,
					{
						label:    __( 'Display form description', 'gravityforms' ),
						checked:  props.attributes.description,
						onChange: onChangeDescription
					}
				),
				el(
					ToggleControl,
					{
						label:    __( 'Enable AJAX', 'gravityforms' ),
						checked:  props.attributes.ajax,
						onChange: onChangeAjax
					}
				)
			),
			(!!props.focus || !props.attributes.id) && el(
				wp.components.Placeholder,
				{
					key:       'placeholder',
					className: 'wp-block-embed',
					label:     __( 'Select a Form', 'gravityforms' )
				},
				el(
					'form',
					{},
					el(
						'select',
						{
							value:    props.attributes.id,
							onChange: onChangeFormPreview
						},
						formOptions
					)
				)
			),
			!props.focus && props.attributes.id && el(
				'p',
				{},
				'This is where the form preview will be displayed.'
			)
		]

	},

	save: function () {
		return null;
	},

} );