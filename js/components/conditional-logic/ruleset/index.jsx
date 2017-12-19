const { __ } = wp.i18n;
const Component = wp.element.Component;
const { IconButton } = wp.components;

import Rule from '../rule/';

export default class Ruleset extends Component {

	constructor() {

		super( ...arguments );

		this.addRule = this.addRule.bind( this );
		this.deleteRule = this.deleteRule.bind( this );
		this.updateRule = this.updateRule.bind( this );

	}

	addRule() {

		let rules = this.getRules(),
			newRules = rules.push( { key: '', operator: '', value: '' } );

		this.setRules( newRules );

	}

	deleteRule( index ) {

		let rules = this.getRules();
		let newRules = rules.splice( index, 1 );

		this.setRules( newRules );

	}

	getRules() {

		return this.props.rules;

	}

	setRules( rules ) {

		//this.props.rules = rules;
		this.props.onChange( { rules: rules } );
		this.props.rules = rules;

	}

	updateRule( rule, index ) {

		let rules = this.getRules();

		rules[ index ] = rule;

		this.props.onChange( rules );

	}

	getOptions() {

		return [
			{
				key:       {
					label: 'User',
					value: 'user'
				},
				operators: [ 'is', 'is not' ],
				value:     [
					{
						label: 'Logged In',
						value: 'logged-in'
					},
					{
						label: 'Logged Out',
						value: 'logged-out'
					},
					{
						label:   'Roles',
						choices: [
							{
								label: 'Administrator',
								value: 'administrator'
							},
							{
								label: 'Editor',
								value: 'editor'
							},
							{
								label: 'Contributor',
								value: 'contributor'
							},
							{
								label: 'Subscriber',
								value: 'subscriber'
							},
						]
					}
				]
			}
		]

	}

	render() {

		const addRule = () => this.addRule();

		let rules = this.props.rules;

		//console.log( rules );

		// let rules = this.getRules(),
		//console.table( rules );
		//console.log( rules.length );
		console.log( 'Length from render:' + this.props.rules.length );

		let rulesNodes = [];

		if ( rules.length > 0 ) {
			rulesNodes = rules.map( ( rule, index ) => <Rule rule={rule} index={index} onChange={this.updateRule}
															 onDelete={this.deleteRule}/> );
		}

		return [
			rulesNodes,
			<IconButton
				icon="insert"
				label={__( 'Add Rule' )}
				onClick={addRule}
				className="editor-inserter__toggle"/>
		];

	}

}
