const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const el = wp.element.createElement;
const { SelectControl, ToggleControl } = wp.blocks.InspectorControls;
const InspectorControls = wp.blocks.InspectorControls;
const { Placeholder, SandBox, Spinner } = wp.components;
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
			default: false
		}
	},

	edit: class extends Component {

		constructor() {

			super( ...arguments );

			this.setFormId = this.setFormId.bind( this );
			this.updateFormPreview = this.updateFormPreview.bind( this );

			this.state = {
				html:     '',
				fetching: false,
			}

		}

		componentWillMount() {

			if ( this.props.attributes.formId ) {
				this.setState( { fetching: true } );
				this.updateFormPreview( this.props.attributes );
			}

		}

		componentWillReceiveProps( props ) {

			if ( props.attributes === this.props.attributes ) {
				return;
			}

			this.updateFormPreview( props.attributes );

		}

		componentWillUnmount() {

			this.unmounting = true;

		}

		setFormId( formId ) {

			this.props.setAttributes( { formId: formId } );

		}

		updateFormPreview( attributes ) {

			if ( this.state.fetching ) {
				return;
			}

			const { formId, title, description, ajax } = attributes;
			const apiURL = wpApiSettings.root + 'gf/v2/block/preview?formId=' + formId + '&title=' + title + '&description=' + description + '&ajax=' + ajax;

			this.setState( { fetching: true } );

			window.fetch( apiURL ).then(
				( response ) => {

					if ( this.unmounting ) {
						return;
					}

					response.json().then( ( obj ) => {

						if ( obj.success ) {
							this.setState( { html: obj.data.html } );
						} else {
							this.setState( { html: '<p>' + __( 'Could not load form.', 'gravityforms' ) + '</p>' } );
						}

						this.setState( { fetching: false } );

					} );

				}
			);

		}

		render() {

			const { html, fetching } = this.state;
			const { formId, title, description, ajax } = this.props.attributes;
			const { setAttributes, focus } = this.props;

			const toggleTitle = () => setAttributes( { title: !title } );
			const toggleDescription = () => setAttributes( { description: !description } );
			const toggleAjax = () => setAttributes( { ajax: !ajax } );

			const setFormIdFromPlaceholder = ( e ) => this.setFormId( e.target.value );

			const controls = [
				focus && (
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
				)
			];

			if ( fetching ) {
				return [
					controls,
					<div key="loading" className="wp-block-embed is-loading">
						<Spinner/>
						<p>{__( 'Loading form preview...', 'gravityforms' )}</p>
					</div>
				];
			}

			if ( !html ) {

				return [
					controls,
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
				];

			}

			return [
				controls,
				<div className="wp-block-embed__wrapper">
					<SandBox html={html} type="html"/>
				</div>
			];

		}

	},

	save: function () {
		return null;
	},

} );