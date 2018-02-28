const { __ } = wp.i18n;
const { InspectorControls, registerBlockType } = wp.blocks;
const { Dashicon, PanelBody, Placeholder, SelectControl, Spinner, TextControl, ToggleControl } = wp.components;
const { Component, RawHTML } = wp.element;

import { addQueryArgs } from '@wordpress/url';
import SandBox from '../components/sandbox/';
import LogicControl from '../components/conditional-logic/'

registerBlockType( 'pods/block', {

	title:       'Pods',
	description: __( 'Select a form below to add it to your page.', 'pods-gutenberg-blocks' ),
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
					className='dashicon dashicon-pods'>
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
				tag:        [ 'pods' ],
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
				html:         '',
				fetching:     false,
				previewError: false,
			}

		}

		componentWillMount() {

			let { formId, formPreview } = this.props.attributes;
			let formFound = false;

			if ( ! formId ) {
				return;
			}

			for ( let i = 0; i < pods.forms.length; i ++ ) {
				if ( pods.forms[ i ].value == formId ) {
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

			if ( ! props.attributes.formId ) {
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

			if ( this.state.fetching || ! atts.formPreview ) {
				return;
			}

			const { formId, title, description } = atts;

			const apiURL = addQueryArgs( wpApiSettings.root + 'pods/v2/block/preview', {
				formId:      formId,
				title:       title ? title : false,
				description: description ? description : false,
				type:        'pods/block'
			} );

			this.setState( { fetching: true } );

			window.fetch( apiURL ).then(
				( response ) => {

					if ( this.unmounting ) {
						return;
					}

					response.json().catch( ( error ) => {
						return { success: false };
					} ).then( ( obj ) => {

						if ( obj.success ) {
							this.setState( {
								fetching:     false,
								html:         obj.data.html,
								previewError: false
							} );
						} else {
							this.setState( {
								fetching:     false,
								previewError: true
							} );
						}

					} );

				},
			);

		}

		render() {

			let { formId, title, description, ajax, tabindex, formPreview, conditionalLogic } = this.props.attributes;

			const { html, fetching, previewError } = this.state;
			const { setAttributes, isSelected } = this.props;

			const toggleTitle = () => setAttributes( { title: ! title } );
			const toggleDescription = () => setAttributes( { description: ! description } );
			const toggleAjax = () => setAttributes( { ajax: ! ajax } );
			const toggleFormPreview = () => setAttributes( { formPreview: ! formPreview } );
			const toggleConditionalLogic = () => setAttributes( {
				conditionalLogic: {
					...conditionalLogic,
					enabled: ! conditionalLogic.enabled,
				},
			} );

			const updateTabindex = ( tabindex ) => setAttributes( { tabindex: tabindex } );
			const updateConditionalLogic = ( logic ) => setAttributes( { conditionalLogic: { ...conditionalLogic, ...logic } } );

			const setFormIdFromPlaceholder = ( e ) => this.setFormId( e.target.value );

			const controls = [
				isSelected && (
					<InspectorControls key="inspector">
						<SelectControl
							label={ __( 'Form', 'pods-gutenberg-blocks' ) }
							value={ formId }
							options={ pods.forms }
							onChange={ this.setFormId }
						/>
						<ToggleControl
							label={ __( 'Form Title', 'pods-gutenberg-blocks' ) }
							checked={ title }
							onChange={ toggleTitle }
						/>
						<ToggleControl
							label={ __( 'Form Description', 'pods-gutenberg-blocks' ) }
							checked={ description }
							onChange={ toggleDescription }
						/>
						<PanelBody
							title={ __( 'Conditional Logic', 'pods-gutenberg-blocks' ) }
							className="pods-block__panel"
						>
							<ToggleControl
								label={ __( 'Conditional Logic', 'pods-gutenberg-blocks' ) }
								checked={ conditionalLogic.enabled }
								onChange={ toggleConditionalLogic }
							/>
							{
								conditionalLogic.enabled &&
								<LogicControl
									key="pods-block__conditional"
									logic={ conditionalLogic }
									onChange={ updateConditionalLogic }
								/>
							}
						</PanelBody>
						<PanelBody
							title={ __( 'Advanced', 'pods-gutenberg-blocks' ) }
							initialOpen={ false }
							className="pods-block__panel"
						>
							<ToggleControl
								label={ __( 'Preview', 'pods-gutenberg-blocks' ) }
								checked={ formPreview }
								onChange={ toggleFormPreview }
							/>
							<ToggleControl
								label={ __( 'AJAX', 'pods-gutenberg-blocks' ) }
								checked={ ajax }
								onChange={ toggleAjax }
							/>
							<TextControl
								label={ __( 'Tabindex', 'pods-gutenberg-blocks' ) }
								value={ tabindex }
								onChange={ updateTabindex }
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
						<p>{ __( 'Loading form preview...', 'pods-gutenberg-blocks' ) }</p>
					</div>,
				];
			}

			if ( previewError ) {
				return [
					controls,
					<div key="loading" className="wp-block-embed is-loading">
						<Dashicon icon="dismiss"/>
						<p>{ __( 'Could not load form preview.', 'pods-gutenberg-blocks' ) }</p>
					</div>,
				];
			}

			if ( ! html || ! formPreview ) {

				return [
					controls,
					<Placeholder key="placeholder" className="wp-block-embed pods-block__placeholder">
						<div className="pods-block__placeholder-brand">
							<img src={ pods.icon } width="110"/>
							<p><strong>Pods</strong></p>
						</div>
						<form>
							<select value={ formId } onChange={ setFormIdFromPlaceholder }>
								{ pods.forms.map( form =>
									<option key={ form.value } value={ form.value }>{ form.label }</option>,
								) }
							</select>
						</form>
					</Placeholder>,
				];

			}

			return [
				controls,
				<div key="sandbox" className="wp-block-embed__wrapper">
					<SandBox html={ html }/>
				</div>,
			];

		}

	},

	save: function ( props ) {

		let { formId, title, description, ajax, tabindex } = props.attributes;
		let shortcode = `[pods id="${formId}" title="${ title ? 'true' : 'false' }" description="${ description ? 'true' : 'false' }" ajax="${ ajax ? 'true' : 'false' }" tabindex="${ tabindex ? tabindex : 0 }"]`;

		return formId ? <RawHTML>{ shortcode }</RawHTML> : null;

	},

} );