const { __ } = wp.i18n;
const { InspectorControls } = wp.blocks;
const { Dashicon, PanelBody, Placeholder, SelectControl, Spinner, TextControl, ToggleControl } = wp.components;
const { Component, RawHTML } = wp.element;

import createFragment from 'react-addons-create-fragment';
import { addQueryArgs } from '@wordpress/url';
import SandBox from '../../components/sandbox/';
import LogicControl from '../../components/conditional-logic/'

export class buildEditObject extends Component {

	constructor() {

		super( ...arguments );

		this.setFormId = this.setFormId.bind( this );
		this.updateBlockPreview = this.updateBlockPreview.bind( this );

		this.state = {
			html:         '',
			block_object: this.props.block_object,
			fetching:     false,
			previewError: false,
		}

	}

	componentWillMount() {

		let { formId, show_preview } = this.props.attributes;
		let formFound = false;

		if ( ! formId ) {
			return;
		}

		for ( let i = 0; i < pods_gutenberg.pods.length; i ++ ) {
			if ( pods_gutenberg.pods[ i ].value === formId ) {
				formFound = true;
			}
		}

		if ( ! formFound ) {
			this.props.setAttributes( { formId: '' } );
			return;
		}

		if ( this.props.attributes.formId && this.props.attributes.show_preview ) {
			this.setState( { fetching: true } );
			this.updateBlockPreview( this.props.attributes );
		}

	}

	componentWillReceiveProps( props ) {

		let oldAtts = this.props.attributes,
			newAtts = props.attributes;

		if ( oldAtts.formId === newAtts.formId && oldAtts.title === newAtts.title && oldAtts.description === newAtts.description && oldAtts.show_preview === newAtts.show_preview ) {
			return;
		}

		if ( ! props.attributes.formId ) {
			this.setState( { html: '' } );
			return;
		}

		this.updateBlockPreview( props.attributes );

	}

	componentWillUnmount() {

		this.unmounting = true;

	}

	setFormId( formId ) {

		this.props.setAttributes( { formId: formId } );

	}

	updateBlockPreview( atts ) {

		if ( this.state.fetching || ! atts.show_preview ) {
			return;
		}

		atts.type = this.props.block_object.type;

		const apiURL = addQueryArgs( wpApiSettings.root + this.props.block_object.rest_preview_url, atts );

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

		let { formId, title, description, ajax, tabindex, show_preview, conditional_logic } = this.props.attributes;

		const { html, fetching, previewError, block_object } = this.state;
		const { setAttributes, isSelected } = this.props;

		const toggleTitle = () => setAttributes( { title: ! title } );
		const toggleDescription = () => setAttributes( { description: ! description } );
		const toggleAjax = () => setAttributes( { ajax: ! ajax } );
		const toggleshowPreview = () => setAttributes( { show_preview: ! show_preview } );
		const toggleConditionalLogic = () => setAttributes( {
																conditional_logic: {
																	...conditional_logic,
																	enabled: ! conditional_logic.enabled,
																},
															} );

		const updateTabindex = ( tabindex ) => setAttributes( { tabindex: tabindex } );
		const updateConditionalLogic = ( logic ) => setAttributes( { conditional_logic: { ...conditional_logic, ...logic } } );

		const setFormIdFromPlaceholder = ( e ) => this.setFormId( e.target.value );

		let controls = [];

		if ( isSelected ) {
			let controls = {};

			controls.pod = (
				<InspectorControls key="inspector">
					<SelectControl
						label={ __( 'Pod', 'pods-gutenberg-blocks' ) }
						value={ formId }
						options={ pods_gutenberg.pods }
						onChange={ this.setFormId }
					/>
				</InspectorControls>
			);

			controls.conditional_logic = (
				<InspectorControls key="inspector">
					<PanelBody
						title={ __( 'Conditional Logic', 'pods-gutenberg-blocks' ) }
						className="pods-block__panel"
					>
						<ToggleControl
							label={ __( 'Conditional Logic', 'pods-gutenberg-blocks' ) }
							checked={ conditional_logic.enabled }
							onChange={ toggleConditionalLogic }
						/>
						{
							conditional_logic.enabled &&
							<LogicControl
								key="pods-block__conditional"
								logic={ conditional_logic }
								onChange={ updateConditionalLogic }
							/>
						}
					</PanelBody>
				</InspectorControls>
			);

			controls.advanced = (
				<InspectorControls key="inspector">
					<PanelBody
						title={ __( 'Advanced', 'pods-gutenberg-blocks' ) }
						initialOpen={ false }
						className="pods-block__panel"
					>
						<ToggleControl
							label={ __( 'Preview', 'pods-gutenberg-blocks' ) }
							checked={ show_preview }
							onChange={ toggleshowPreview }
						/>
					</PanelBody>
				</InspectorControls>
			);

			controls = [
				createFragment( controls ),
			];
		}

		if ( fetching ) {
			return [
				controls,
				<div key="loading" className="wp-block-embed is-loading">
					<Spinner/>
					<p>{ __( 'Loading block preview...', 'pods-gutenberg-blocks' ) }</p>
				</div>,
			];
		}

		if ( previewError ) {
			return [
				controls,
				<div key="loading" className="wp-block-embed is-loading">
					<Dashicon icon="dismiss"/>
					<p>{ __( 'Could not load block preview.', 'pods-gutenberg-blocks' ) }</p>
				</div>,
			];
		}

		if ( ! html || ! show_preview ) {
			let block_title = block_object.title;

			return [
				controls,
				<Placeholder key="placeholder" className="wp-block-embed pods-block__placeholder">
					<div className="pods-block__placeholder-brand">
						<img src={ pods_gutenberg.icon } width="110"/>
						<p><strong>{ block_title }</strong></p>
					</div>
					<form>
						<select value={ formId } onChange={ setFormIdFromPlaceholder }>
							{ pods_gutenberg.pods.map( pod =>
														   <option key={ pod.value } value={ pod.value }>{ pod.label }</option>,
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

}
