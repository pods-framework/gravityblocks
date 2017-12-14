const { __ } = wp.i18n;
const { registerBlockType, BlockDescription } = wp.blocks;
const el = wp.element.createElement;
const { SelectControl, TextControl, ToggleControl } = wp.blocks.InspectorControls;
const InspectorControls = wp.blocks.InspectorControls;
const { PanelBody, Placeholder, SandBox, Spinner } = wp.components;
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
		},
		tabindex:    {
			type: 'integer',
		},
		formPreview: {
			type:    'bool',
			default: true,
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

			if ( this.props.attributes.formId && this.props.attributes.formPreview ) {
				this.setState( { fetching: true } );
				this.updateFormPreview( this.props.attributes );
			}

		}

		componentWillReceiveProps( props ) {

			if ( props.attributes === this.props.attributes ) {
				return;
			}

			if ( !props.attributes.formId ) {
				this.setState( { html: '' } );
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
			const apiURL = wpApiSettings.root + 'gf/v2/block/preview?formId=' + formId + '&title=' + (title ? title : false) + '&description=' + (description ? description : false) + '&ajax=' + (ajax ? ajax : false);

			this.setState( { fetching: true } );

			window.fetch( apiURL ).then(
				( response ) => {

					if ( this.unmounting ) {
						return;
					}

					response.json().then( ( obj ) => {

						if ( obj.success ) {
							this.setState( { html: obj.data.scripts + obj.data.html } );
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
			const { formId, title, description, ajax, tabindex, formPreview } = this.props.attributes;
			const { setAttributes, focus } = this.props;

			const toggleTitle = () => setAttributes( { title: !title } );
			const toggleDescription = () => setAttributes( { description: !description } );
			const toggleAjax = () => setAttributes( { ajax: !ajax } );
			const toggleFormPreview = () => setAttributes( { formPreview: !formPreview } );
			const updateTabindex = ( tabindex ) => setAttributes( { tabindex: tabindex } );

			const setFormIdFromPlaceholder = ( e ) => this.setFormId( e.target.value );

			const controls = [
				focus && (
					<InspectorControls key="inspector">
						<BlockDescription>
							<p>Gravity Forms</p>
						</BlockDescription>
						<SelectControl
							label={__( 'Form', 'gravityforms' )}
							value={formId}
							options={gform.forms}
							onChange={this.setFormId}
						/>
						<ToggleControl
							label={__( 'Form Title', 'gravityforms' )}
							checked={title}
							onChange={toggleTitle}
						/>
						<ToggleControl
							label={__( 'Form Description', 'gravityforms' )}
							checked={description}
							onChange={toggleDescription}
						/>
						<PanelBody title={__( 'Advanced Settings', 'gravityforms' )} initialOpen={false}>
							<ToggleControl
								label={__( 'Preview', 'gravityforms' )}
								checked={formPreview}
								onChange={toggleFormPreview}
							/>
							<ToggleControl
								label={__( 'AJAX', 'gravityforms' )}
								checked={ajax}
								onChange={toggleAjax}
							/>
							<TextControl
								label={__( 'Tabindex', 'gravityforms' )}
								value={tabindex}
								onChange={updateTabindex}
								placeholder="-1"
							/>
						</PanelBody>
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

			if ( !html || !formPreview ) {

				return [
					controls,
					<Placeholder key="placeholder" className="wp-block-embed gform-block-placeholder">
						<div className="gform-block-placeholder-brand">
							<img src={gform.icon} width="110"/>
							<p><strong>Gravity Forms</strong></p>
						</div>
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