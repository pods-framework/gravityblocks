const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const el = wp.element.createElement;
const { SelectControl, ToggleControl } = wp.blocks.InspectorControls;
const InspectorControls = wp.blocks.InspectorControls;
const Placeholder = wp.components.Placeholder;
const Component = wp.element.Component;

registerBlockType( 'gravityforms/block', {

	title:      'Gravity Forms',
	icon:       'feedback',
	category:   'embed',
	supports:   {
		customClassName: false,
		className:       false
	},
	attributes: {
		formId:      {
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

	edit: class extends Component {

		constructor() {

			super( ...arguments );

		}

		render() {

			const { formId, title, description, ajax } = this.props.attributes;
			const { setAttributes, focus } = this.props;

			const toggleTitle = () => setAttributes( { title: !title } );
			const toggleDescription = () => setAttributes( { description: !description } );
			const toggleAjax = () => setAttributes( { ajax: !ajax } );
			const changeForm = ( formId ) => setAttributes( { formId: formId } );
			const changeFormPreview = ( event ) => setAttributes( { formId: event.target.value } );

			return [
				!!focus && (
					<InspectorControls key="inspector">
						<SelectControl
							label={__( 'Select form', 'gravityforms' )}
							value={formId}
							options={gform.forms}
							onChange={changeForm}
						/>
						<ToggleControl
							label={__( 'Display form title', 'gravityforms' )}
							checked={title}
							onChange={toggleTitle}
						/>
						<ToggleControl
							label={__( 'Display form description', 'gravityforms' )}
							checked={description}
							onChange={toggleDescription}
						/>
						<ToggleControl
							label={__( 'Enable AJAX', 'gravityforms' )}
							checked={ajax}
							onChange={toggleAjax}
						/>
					</InspectorControls>
				),
				(!!focus || !formId) && (
					<Placeholder key="placeholder" className="wp-block-embed"
								 label={__( 'Select a Form', 'gravityforms' )}>
						<form>
							<select value={formId} onChange={changeFormPreview}>
								{gform.forms.map( form =>
									<option key={form.value} value={form.value}>{form.label}</option>
								)}
							</select>
						</form>
					</Placeholder>
				),
				!focus && formId && (
					<p>
						This is where the form preview will be displayed.
					</p>
				)
			]

		}

	},

	save: function () {
		return null;
	},

} );