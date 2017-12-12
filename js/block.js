const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const el = wp.element.createElement;
const { SelectControl, ToggleControl } = wp.blocks.InspectorControls;
const InspectorControls = wp.blocks.InspectorControls;
const Placeholder = wp.components.Placeholder;

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
			!!props.focus && (
				<InspectorControls key="inspector">
					<SelectControl
						label={__( 'Select form', 'gravityforms' )}
						value={props.attributes.id}
						options={gform.forms}
						onChange={onChangeForm}
					/>
					<ToggleControl
						label={__( 'Display form title', 'gravityforms' )}
						checked={props.attributes.title}
						onChange={onChangeTitle}
					/>
					<ToggleControl
						label={__( 'Display form description', 'gravityforms' )}
						checked={props.attributes.description}
						onChange={onChangeDescription}
					/>
					<ToggleControl
						label={__( 'Enable AJAX', 'gravityforms' )}
						checked={props.attributes.ajax}
						onChange={onChangeAjax}
					/>
				</InspectorControls>
			),
			(!!props.focus || !props.attributes.id) && (
				<Placeholder key="placeholder" className="wp-block-embed" label={__( 'Select a Form', 'gravityforms' )}>
					<form>
						<select value={props.attributes.id} onChange={onChangeFormPreview}>
							{formOptions}
						</select>
					</form>
				</Placeholder>
			),
			!props.focus && props.attributes.id && (
				<p>
					This is where the form preview will be displayed.
				</p>
			)
		]

	},

	save: function () {
		return null;
	},

} );