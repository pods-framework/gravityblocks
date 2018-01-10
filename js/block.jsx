const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { SelectControl, TextControl, ToggleControl } = wp.blocks.InspectorControls;
const InspectorControls = wp.blocks.InspectorControls;
const { PanelBody, Placeholder, Spinner } = wp.components;
const Component = wp.element.Component;

import { addQueryArgs } from '@wordpress/url';
import SandBox from './components/sandbox/';
import LogicControl from './components/conditional-logic/'

registerBlockType( 'gravityforms/block', {

	title:       'Gravity Forms',
	description: __( 'Select a form below to add it to your page.', 'gravityforms' ),
	category:    'embed',
	supports:    {
		customClassName: false,
		className:       false,
		html:            false,
	},
	attributes:  {
		formId:           {
			type: 'integer',
		},
		title:            {
			type:    'bool',
			default: true,
		},
		description:      {
			type:    'bool',
			default: true,
		},
		ajax:             {
			type:    'bool',
			default: false,
		},
		conditionalLogic: {
			type:    'object',
			default: {
				enabled:    false,
				actionType: 'show',
				logicType:  'all',
				rules:      [],
			},
		},
		tabindex:         {
			type: 'integer',
		},
		formPreview:      {
			type:    'bool',
			default: true,
		},
	},
	icon:        () => {
		return <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 508.3 559.5' width='20px' height='20px'
					focusable='false' aria-hidden='true'
					className='dashicon dashicon-gravityforms'>
			<g>
				<path className='st0'
					  d='M468,109.8L294.4,9.6c-22.1-12.8-58.4-12.8-80.5,0L40.3,109.8C18.2,122.6,0,154,0,179.5V380	c0,25.6,18.1,56.9,40.3,69.7l173.6,100.2c22.1,12.8,58.4,12.8,80.5,0L468,449.8c22.2-12.8,40.3-44.2,40.3-69.7V179.6	C508.3,154,490.2,122.6,468,109.8z M399.3,244.4l-195.1,0c-11,0-19.2,3.2-25.6,10c-14.2,15.1-18.2,44.4-19.3,60.7H348v-26.4h49.9	v76.3H111.3l-1.8-23c-0.3-3.3-5.9-80.7,32.8-121.9c16.1-17.1,37.1-25.8,62.4-25.8h194.7V244.4z'
				/>
			</g>
		</svg>
	},

	transforms: {
		from: [
			{
				type:       'shortcode',
				tag:        [ 'gravityform', 'gravityforms' ],
				attributes: {
					formId:      {
						type:      'string',
						shortcode: ( { named: { id } } ) => {
							return parseInt( id );
						},
					},
					title:       {
						type:      'bool',
						shortcode: ( { named: { title } } ) => {
							return 'true' === title;
						},
					},
					description: {
						type:      'bool',
						shortcode: ( { named: { description } } ) => {
							return 'true' === description;
						},
					},
					ajax:        {
						type:      'bool',
						shortcode: ( { named: { ajax } } ) => {
							return 'true' === ajax;
						},
					},
					tabindex:    {
						type:      'integer',
						shortcode: ( { named: { tabindex } } ) => {
							return parseInt( tabindex );
						},
					}
				},
			}
		]
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

			let { formId, formPreview } = this.props.attributes;
			let formFound = false;

			if ( ! formId ) {
				return;
			}

			for ( let i = 0; i < gform.forms.length; i++ ) {
				if ( gform.forms[ i ].value == formId ) {
					formFound = true;
				}
			}

			if ( ! formFound ) {
				this.props.setAttributes( { formId: '' } );
				return;
			}

			if ( this.props.attributes.formId && this.props.attributes.formPreview ) {
				this.setState( { fetching: true } );
				this.updateFormPreview( this.props.attributes );
			}

		}

		componentWillReceiveProps( props ) {

			let oldAtts = this.props.attributes,
				newAtts = props.attributes;

			if ( oldAtts.formId === newAtts.formId && oldAtts.title === newAtts.title && oldAtts.description === newAtts.description && oldAtts.formPreview === newAtts.formPreview ) {
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

		updateFormPreview( atts ) {

			if ( this.state.fetching || !atts.formPreview ) {
				return;
			}

			const { formId, title, description } = atts;

			const apiURL = addQueryArgs( wpApiSettings.root + 'gf/v2/block/preview', {
				formId:      formId,
				title:       title ? title : false,
				description: description ? description : false
			} );

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
							this.setState( { html: `<p>${__( 'Could not load form.', 'gravityforms' )}</p>` } );
						}

						this.setState( { fetching: false } );

					} );

				},
			);

		}

		render() {

			let { formId, title, description, ajax, tabindex, formPreview, conditionalLogic } = this.props.attributes;

			const { html, fetching } = this.state;
			const { setAttributes, focus, setFocus } = this.props;

			const toggleTitle = () => setAttributes( { title: !title } );
			const toggleDescription = () => setAttributes( { description: !description } );
			const toggleAjax = () => setAttributes( { ajax: !ajax } );
			const toggleFormPreview = () => setAttributes( { formPreview: !formPreview } );
			const toggleConditionalLogic = () => setAttributes( {
				conditionalLogic: {
					...conditionalLogic,
					enabled: !conditionalLogic.enabled,
				},
			} );

			const updateTabindex = ( tabindex ) => setAttributes( { tabindex: tabindex } );
			const updateConditionalLogic = ( logic ) => setAttributes( { conditionalLogic: { ...conditionalLogic, ...logic } } );

			const setFormIdFromPlaceholder = ( e ) => this.setFormId( e.target.value );

			const controls = [
				focus && (
					<InspectorControls key="inspector">
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
						<PanelBody
							title={__( 'Conditional Logic', 'gravityforms' )}
							className="gform-block__panel"
						>
							<ToggleControl
								label={__( 'Conditional Logic', 'gravityforms' )}
								checked={conditionalLogic.enabled}
								onChange={toggleConditionalLogic}
							/>
							{
								conditionalLogic.enabled &&
								<LogicControl
									logic={conditionalLogic}
									onChange={updateConditionalLogic}
								/>
							}
						</PanelBody>
						<PanelBody
							title={__( 'Advanced', 'gravityforms' )}
							initialOpen={false}
							className="gform-block__panel"
						>
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
				),
			];

			if ( fetching ) {
				return [
					controls,
					<div key="loading" className="wp-block-embed is-loading">
						<Spinner/>
						<p>{__( 'Loading form preview...', 'gravityforms' )}</p>
					</div>,
				];
			}

			if ( !html || !formPreview ) {

				return [
					controls,
					<Placeholder key="placeholder" className="wp-block-embed gform-block__placeholder">
						<div className="gform-block__placeholder-brand">
							<img src={gform.icon} width="110"/>
							<p><strong>Gravity Forms</strong></p>
						</div>
						<form>
							<select value={formId} onChange={setFormIdFromPlaceholder}>
								{gform.forms.map( form =>
									<option key={form.value} value={form.value}>{form.label}</option>,
								)}
							</select>
						</form>
					</Placeholder>,
				];

			}

			return [
				controls,
				<div key="sandbox" className="wp-block-embed__wrapper">
					<SandBox html={html} onFocus={() => setFocus()}/>
				</div>,
			];

		}

	},

	save: function ( props ) {

		let { formId, title, description, ajax, tabindex } = props.attributes;

		return formId ? `[gravityform id="${formId}" title="${ title ? 'true' : 'false' }" description="${ description ? 'true' : 'false' }" ajax="${ ajax ? 'true' : 'false' }" tabindex="${ tabindex ? tabindex : 0 }"]` : null;

	},

} );