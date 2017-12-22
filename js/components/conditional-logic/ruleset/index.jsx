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
			newRules = [ ...rules, this.getDefaultOption() ];

		this.setRules( newRules );

	}

	deleteRule( index ) {

		let rules = this.getRules();
		rules.splice( index, 1 );

		this.setRules( rules );

	}

	getRules() {

		return this.props.rules;

	}

	setRules( rules ) {

		this.props.onChange( rules );

	}

	updateRule( rule, index ) {

		let rules = this.getRules();

		rules[ index ] = rule;

		this.props.onChange( rules );

	}

	getOptions() {

		return gform.conditionalOptions;

	}

	getDefaultOption() {

		let options = this.getOptions(),
			option = options[ 0 ];

		return {
			key:      option.key.value,
			operator: option.operators[ 0 ].value,
			value:    option.value.choices ? ( option.value.choices[ 0 ].choices ? option.value.choices[ 0 ].choices[ 0 ].value : option.value.choices[ 0 ].value ) : ''
		};

	}

	render() {

		let rules = this.props.rules;
		let options = this.getOptions();

		return [
			rules && (
				rules.map( ( rule, index ) => <Rule options={options} rule={rule} key={index} index={index}
													updateRule={this.updateRule}
													deleteRule={this.deleteRule}/> )
			),
			<div className="gform-block__conditional-rule-add">
				<IconButton
					key="icon"
					icon="insert"
					label={__( 'Add Rule' )}
					onClick={this.addRule}
					className="editor-inserter__toggle"/>
			</div>
		];

	}

}
