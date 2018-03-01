const { __ } = wp.i18n;
const { InspectorControls, registerBlockType } = wp.blocks;
const { Dashicon, PanelBody, Placeholder, SelectControl, Spinner, TextControl, ToggleControl } = wp.components;
const { Component, RawHTML } = wp.element;

import { addQueryArgs } from '@wordpress/url';
import SandBox from '../components/sandbox/';
import LogicControl from '../components/conditional-logic/'

let block;
let block_object;

for ( block in pods_gutenberg.block_configs ) {
	block_object = pods_gutenberg.block_configs[ block ];

	registerBlockType( block_object.type, {
		title:       block_object.title,
		description: block_object.description,
		category:    block_object.category,
		supports:    block_object.supports,
		attributes:  block_object.attributes,
		icon:        () => {
			return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20px" height="20px"
				focusable="false" aria-hidden="true"
				className="dashicon dashicon-pods">
					<defs>
						<path d="M0.673556919,223.529876 C0.673556919,346.878779 100.681589,446.874676 224.044146,446.874676 L224.044146,446.874676 C314.787737,446.874676 392.893033,392.771671 427.855795,315.066868 L427.855795,315.066868 C418.118043,285.312036 409.690996,232.962707 443.302093,180.636133 L443.302093,180.636133 C441.863958,173.245211 440.061738,165.98627 437.915155,158.877514 L437.915155,158.877514 C334.84881,261.229342 251.635707,270.815392 188.984295,269.14667 L188.984295,269.14667 C188.404793,269.128466 186.297652,268.787136 185.737872,267.523459 L185.737872,267.523459 C185.737872,267.523459 184.824626,263.430538 187.494581,263.430538 L187.494581,263.430538 C307.525761,263.430538 375.887238,192.805668 431.737849,141.166304 L431.737849,141.166304 C428.691673,133.488666 425.229833,126.02341 421.38267,118.790258 L421.38267,118.790258 C361.175177,102.227433 338.037586,52.9151777 329.82444,26.7647854 L329.82444,26.7647854 C298.338688,9.80450083 262.315529,0.180525391 224.044146,0.180525391 L224.044146,0.180525391 C100.681589,0.180525391 0.673556919,100.176422 0.673556919,223.529876 L0.673556919,223.529876 Z M284.850862,67.4861557 C284.850862,67.4861557 370.127112,58.2065438 395.24138,163.578759 L395.24138,163.578759 C302.055387,157.152662 284.850862,67.4861557 284.850862,67.4861557 L284.850862,67.4861557 Z M250.731563,111.824102 C250.731563,111.824102 326.335293,109.29978 343.545886,203.841989 L343.545886,203.841989 C261.701136,192.000131 250.731563,111.824102 250.731563,111.824102 L250.731563,111.824102 Z M209.203138,149.397655 C209.203138,149.397655 277.241489,144.957338 294.652329,229.613127 L294.652329,229.613127 C220.694566,221.296822 209.203138,149.397655 209.203138,149.397655 L209.203138,149.397655 Z M395.24138,163.578759 C395.338469,163.584827 395.426456,163.590895 395.523546,163.59848 L395.523546,163.59848 L395.318748,163.906436 C395.292959,163.79721 395.267169,163.687985 395.24138,163.578759 L395.24138,163.578759 Z M172.997937,179.257162 C172.997937,179.257162 232.780665,175.347801 248.082846,249.734881 L248.082846,249.734881 C183.09674,242.431946 172.997937,179.257162 172.997937,179.257162 L172.997937,179.257162 Z M125.099545,186.550994 C125.099545,186.550994 182.529374,182.803955 197.224748,254.255601 L197.224748,254.255601 C134.805439,247.239383 125.099545,186.550994 125.099545,186.550994 L125.099545,186.550994 Z M77.6896328,189.838377 C77.6896328,189.838377 129.809892,186.440252 143.14905,251.285276 L143.14905,251.285276 C86.4944174,244.915308 77.6896328,189.838377 77.6896328,189.838377 L77.6896328,189.838377 Z M26.1412902,199.330372 C26.1412902,199.330372 69.8663602,187.834393 88.7047157,240.528086 L88.7047157,240.528086 C86.6552215,240.694958 84.6679252,240.77536 82.7397927,240.77536 L82.7397927,240.77536 C38.8706057,240.773843 26.1412902,199.330372 26.1412902,199.330372 L26.1412902,199.330372 Z M398.293624,203.717594 C398.26025,203.620504 398.225358,203.518864 398.195018,203.423292 L398.195018,203.423292 L398.498422,203.506728 C398.430156,203.576511 398.36189,203.646294 398.293624,203.717594 L398.293624,203.717594 C430.842807,301.8248 372.869885,355.22239 372.869885,355.22239 L372.869885,355.22239 C372.869885,355.22239 332.134861,271.507153 398.293624,203.717594 L398.293624,203.717594 Z M343.545886,203.841989 C343.626288,203.852608 343.708208,203.864745 343.78861,203.876881 L343.78861,203.876881 L343.598982,204.13174 C343.582295,204.033134 343.565608,203.940596 343.545886,203.841989 L343.545886,203.841989 Z M294.652329,229.613127 C294.725146,229.622229 294.802514,229.629814 294.873814,229.638916 L294.873814,229.638916 L294.706942,229.87102 C294.688737,229.781516 294.67205,229.701114 294.652329,229.613127 L294.652329,229.613127 Z M350.369443,238.120575 C350.358824,238.025003 350.348204,237.923363 350.339102,237.826273 L350.339102,237.826273 L350.596996,237.988595 C350.521145,238.034105 350.446811,238.076582 350.369443,238.120575 L350.369443,238.120575 C360.554716,336.779977 297.068942,369.157737 297.068942,369.157737 L297.068942,369.157737 C297.068942,369.157737 276.554279,281.310137 350.369443,238.120575 L350.369443,238.120575 Z M88.8457985,240.51595 L88.7608454,240.685856 C88.7426412,240.632761 88.7214029,240.578148 88.7047157,240.528086 L88.7047157,240.528086 C88.7517433,240.523535 88.7987709,240.520501 88.8457985,240.51595 L88.8457985,240.51595 Z M248.082846,249.734881 C248.146561,249.740949 248.207242,249.748534 248.272474,249.754602 L248.272474,249.754602 L248.129874,249.965468 C248.113187,249.8881 248.098016,249.810732 248.082846,249.734881 L248.082846,249.734881 Z M143.14905,251.285276 C143.205179,251.292861 143.264343,251.298929 143.320473,251.304997 L143.320473,251.304997 L143.190009,251.482488 C143.176356,251.415739 143.16422,251.352024 143.14905,251.285276 L143.14905,251.285276 Z M66.0404355,267.405131 C66.0404355,267.405131 102.813002,232.393824 149.329389,271.431302 L149.329389,271.431302 C135.122496,283.570497 121.677147,287.74837 109.899003,287.74837 L109.899003,287.74837 C83.9078981,287.74837 66.0404355,267.405131 66.0404355,267.405131 L66.0404355,267.405131 Z M197.224748,254.255601 C197.286946,254.261669 197.349143,254.269254 197.411341,254.275322 L197.411341,254.275322 L197.271775,254.48012 C197.256605,254.407303 197.239918,254.328418 197.224748,254.255601 L197.224748,254.255601 Z M293.877132,265.595326 C293.878649,265.508856 293.878649,265.416318 293.880166,265.329848 L293.880166,265.329848 L294.092548,265.510373 C294.019732,265.539196 293.949949,265.566503 293.877132,265.595326 L293.877132,265.595326 C293.004845,354.048216 233.77583,373.604122 233.77583,373.604122 L233.77583,373.604122 C233.77583,373.604122 224.461326,293.223296 293.877132,265.595326 L293.877132,265.595326 Z M149.462887,271.316009 L149.462887,271.543562 C149.417377,271.505636 149.373383,271.469228 149.329389,271.431302 L149.329389,271.431302 C149.371866,271.39186 149.417377,271.353934 149.462887,271.316009 L149.462887,271.316009 Z M119.24233,319.297837 C119.24233,319.297837 138.843747,268.318377 195.137328,278.248791 L195.137328,278.248791 C179.043262,314.939439 153.727231,321.914697 136.815491,321.914697 L136.815491,321.914697 C126.449692,321.914697 119.24233,319.297837 119.24233,319.297837 L119.24233,319.297837 Z M195.216213,278.068265 L195.299649,278.277614 C195.245037,278.268512 195.191941,278.257893 195.137328,278.248791 L195.137328,278.248791 C195.164634,278.18811 195.190424,278.128946 195.216213,278.068265 L195.216213,278.068265 Z M241.391271,281.185742 C241.404924,281.111408 241.418577,281.03404 241.43223,280.959706 L241.43223,280.959706 L241.591517,281.155401 C241.524768,281.16602 241.458019,281.176639 241.391271,281.185742 L241.391271,281.185742 C227.923166,357.235476 174.067436,362.021674 174.067436,362.021674 L174.067436,362.021674 C174.067436,362.021674 177.597542,290.847643 241.391271,281.185742 L241.391271,281.185742 Z"
						id="path-1" />
					</defs>
					<g id="Symbols" fill="none" fillRule="evenodd">
						<g id="pods-circle-green">
							<g id="Group" transform="translate(4 4)">
								<g id="Group-3" transform="translate(28.393 28.351)">
									<mask id="mask-2" fill="#fff">
										<use xlinkHref="#path-1" />
									</mask>
									<polygon id="Fill-1" fill="#95BF3B" mask="url(#mask-2)" points="-14.496644 -14.9896755 458.470777 -14.9896755 458.470777 462.044877 -14.496644 462.044877"
									/>
								</g>
								<path d="M251.897683,15.7707206 C121.690332,15.7707206 15.762887,121.689063 15.762887,251.879727 C15.762887,382.071908 121.690332,487.990251 251.897683,487.990251 C382.105034,487.990251 488.035513,382.071908 488.035513,251.879727 C488.035513,121.689063 382.105034,15.7707206 251.897683,15.7707206 M251.897683,503.545775 C113.114617,503.545775 0.207363011,390.647623 0.207363011,251.879727 C0.207363011,113.110315 113.114617,0.213679625 251.897683,0.213679625 C390.680749,0.213679625 503.591037,113.110315 503.591037,251.879727 C503.591037,390.647623 390.680749,503.545775 251.897683,503.545775"
								id="Fill-4" fill="#95BF3B" />
							</g>
						</g>
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
				this.updateBlockPreview = this.updateBlockPreview.bind( this );

				this.state = {
					html:         '',
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
					if ( pods_gutenberg.pods[ i ].value == formId ) {
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

				atts.type = block_object.type;

				const apiURL = addQueryArgs( wpApiSettings.root + block_object.rest_preview_url, atts );

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

				const { html, fetching, previewError } = this.state;
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

				const controls = [
					isSelected && (
						<InspectorControls key="inspector">
							<SelectControl
								label={ __( 'Pod', 'pods-gutenberg-blocks' ) }
								value={ formId }
								options={ pods_gutenberg.pods }
								onChange={ this.setFormId }
							/>
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
					),
				];

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

					return [
						controls,
						<Placeholder key="placeholder" className="wp-block-embed pods-block__placeholder">
							<div className="pods-block__placeholder-brand">
								<img src={ pods_gutenberg.icon } width="110"/>
								<p><strong>Pods</strong></p>
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

		},

		save: function ( props ) {

			let { name } = props.attributes;
			let shortcode = `[pods name="${name}"]`;

			return name ? <RawHTML>{ shortcode }</RawHTML> : null;

		},

	} );
}