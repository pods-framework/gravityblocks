const { __ } = wp.i18n;
const { Component } = wp.element;
const { Button, Popover, RadioControl } = wp.components;

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
				label: __( 'Show', 'pods-gutenberg-blocks' ),
				value: 'show',
			},
			{
				label: __( 'Hide', 'pods-gutenberg-blocks' ),
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
				label: __( 'all', 'pods-gutenberg-blocks' ),
				value: 'all'
			},
			{
				label: __( 'any', 'pods-gutenberg-blocks' ),
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
			<div className="pods-block__conditional-type">

				<Button className="button-link" onClick={toggleActionType}>
					<div>{this.getActionTypeLabel( actionType )}</div>
					{ this.state.visible.actionType && <Popover onClose={toggleActionType} position="bottom"
							 className="pods-block__conditional-popover">
						<RadioControl options={actionTypes} onChange={changeActionType} selected={actionType}/>
					</Popover> }
				</Button>

				&nbsp;form if&nbsp;

				<Button className="button-link" onClick={toggleLogicType}>
					<div>{this.getLogicTypeLabel( logicType )}</div>
					{ this.state.visible.logicType && <Popover onClose={toggleLogicType} position="bottom"
							 className="pods-block__conditional-popover">
						<RadioControl options={logicTypes} onChange={changeLogicType} selected={logicType}/>
					</Popover> }
				</Button>

				&nbsp;rules match
			</div>

			<Ruleset key="pods-block__conditional-ruleset" rules={rules} onChange={changeRules} />
		</div>);

	}
}