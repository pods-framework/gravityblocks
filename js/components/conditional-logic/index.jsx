const { __ } = wp.i18n;
const { Component } = wp.element;
const { Button, Dashicon, IconButton, Popover } = wp.components;
const { BaseControl, RadioControl } = wp.blocks.InspectorControls;

import Ruleset from './ruleset/';

export default class LogicControl extends Component {

	constructor() {

		super( ...arguments );

		this.state = {
			visible: {
				actionType: false,
				logicType:  false,
			}
		};

	}

	getActionTypes() {

		return [
			{
				label: __( 'Show', 'gravityforms' ),
				value: 'show',
			},
			{
				label: __( 'Hide', 'gravityforms' ),
				value: 'hide',
			}
		];

	}

	getActionTypeLabel( actionType = 'show' ) {

		let actionTypes = this.getActionTypes();

		let targetAction = actionTypes.filter( ( action ) => {
			return action.value === actionType;
		} );

		return targetAction[ 0 ].label;

	}

	getLogicTypes() {
		return [
			{
				label: __( 'all', 'gravityforms' ),
				value: 'all'
			},
			{
				label: __( 'any', 'gravityforms' ),
				value: 'any'
			}
		];
	}

	getLogicTypeLabel( logicType = 'all' ) {

		let logicTypes = this.getLogicTypes();

		let targetLogic = logicTypes.filter( ( logic ) => {
			return logic.value === logicType;
		} );

		return targetLogic[ 0 ].label;

	}

	render() {

		let { actionType, logicType, rules } = this.props.logic;

		const actionTypes = this.getActionTypes();
		const logicTypes = this.getLogicTypes();

		const toggleActionType = () => this.setState( { visible: { actionType: !this.state.visible.actionType } } );
		const toggleLogicType = () => this.setState( { visible: { logicType: !this.state.visible.logicType } } );

		const changeActionType = ( actionType ) => this.props.onChange( { actionType: actionType } );
		const changeLogicType = ( logicType ) => this.props.onChange( { logicType: logicType } );

		const changeRules = ( rules ) => { this.props.onChange( { rules: rules } ); }

		return (<div>
			<div className="gform-block__conditional-type">

				<Button className="button-link" onClick={toggleActionType}>
					<div>{this.getActionTypeLabel( actionType )}</div>
					<Popover isOpen={this.state.visible.actionType} onClose={toggleActionType} position="bottom"
							 className="gform-block__conditional-popover">
						<RadioControl options={actionTypes} onChange={changeActionType} value={actionType}/>
					</Popover>
				</Button>

				&nbsp;form if&nbsp;

				<Button className="button-link" onClick={toggleLogicType}>
					<div>{this.getLogicTypeLabel( logicType )}</div>
					<Popover isOpen={this.state.visible.logicType} onClose={toggleLogicType} position="bottom"
							 className="gform-block__conditional-popover">
						<RadioControl options={logicTypes} onChange={changeLogicType} value={logicType}/>
					</Popover>
				</Button>

				&nbsp;rules match
			</div>

			<Ruleset rules={rules} onChange={changeRules} />
		</div>);

	}
}