const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const el = wp.element.createElement;
const { SelectControl, ToggleControl } = wp.blocks.InspectorControls;
const InspectorControls = wp.blocks.InspectorControls;
const { Placeholder, SandBox } = wp.components;
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

			this.setFormId = this.setFormId.bind( this );
			this.updateFormPreview = this.updateFormPreview.bind( this );

			this.updateFormPreview();

		}

		componentWillMount() {

			this.setState( { html: '' } );

		}

		setFormId( formId ) {

			this.props.setAttributes( { formId: formId } );
			this.updateFormPreview();

		}

		updateFormPreview() {

			let data = {
				action:     'gform_gutenberg_preview',
				attributes: this.props.attributes
			};

			wp.apiRequest.transport( {
				url:      ajaxurl,
				method:   'GET',
				dataType: 'json',
				data:     data,
				success:  function ( response ) {
					this.setState( { html: response.data.html } )
				}.bind( this )
			} );

		}

		render() {

			const { formId, title, description, ajax } = this.props.attributes;
			const { setAttributes, focus } = this.props;

			const toggleTitle = () => setAttributes( { title: !title } );
			const toggleDescription = () => setAttributes( { description: !description } );
			const toggleAjax = () => setAttributes( { ajax: !ajax } );
			const setFormIdFromPlaceholder = ( e ) => this.setFormId( e.target.value );

			return [
				!!focus && (
					<InspectorControls key="inspector">
						<SelectControl
							label={__( 'Select form', 'gravityforms' )}
							value={formId}
							options={gform.forms}
							onChange={this.setFormId}
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
							<select value={formId} onChange={setFormIdFromPlaceholder}>
								{gform.forms.map( form =>
									<option key={form.value} value={form.value}>{form.label}</option>
								)}
							</select>
						</form>
					</Placeholder>
				),
				!focus && formId && (
					<SandBox html={this.state.html}/>
				)
			]

		}

	},

	save: function () {
		return null;
	},

} );