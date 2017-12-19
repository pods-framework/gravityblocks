const Component = wp.element.Component;
const { Dashicon } = wp.components;

export default class Rule extends Component {

	constructor() {

		super( ...arguments );

	}

	updateKey( key ) {

		let rule = this.props.rule;

		rule.key = key;
		this.props.updateRule( rule, this.props.index );

		this.forceUpdate();

	}

	updateOperator( operator ) {

		let rule = this.props.rule;

		rule.operator = operator;

		this.props.updateRule( rule, this.props.index );

		this.forceUpdate();

	}

	updateValue( value ) {

		let rule = this.props.rule;

		rule.value = value;
		this.props.updateRule( rule, this.props.index );

		this.forceUpdate();

	}

	getOptions() {

		return gform.conditionalOptions;

	}

	getOperatorsForKey( key = false ) {

		let options = gform.conditionalOptions;

		for ( let i = 0; i < options.length; i++ ) {

			if ( options[ i ].key.value !== key && key ) {
				continue;
			}

			return options[ i ].operators;

		}

		return [];

	}

	getValuesForKey( key = false ) {

		let options = gform.conditionalOptions;

		for ( let i = 0; i < options.length; i++ ) {

			if ( options[ i ].key.value !== key && key ) {
				continue;
			}

			return options[ i ].value;

		}

		return [];

	}

	render() {

		let { key, operator, value } = this.props.rule;

		const options = this.getOptions();

		const deleteRule = () => this.props.deleteRule( this.props.index );

		const updateKey = ( e ) => this.updateKey( e.target.value );
		const updateOperator = ( e ) => this.updateOperator( e.target.value );
		const updateValue = ( e ) => this.updateValue( e.target.value );

		const keySelect = <select
			className="gform-block__conditional-rule-key"
			value={key}
			onChange={updateKey}>
			{
				options.map( ( option ) =>
					<option key={option.key.value} value={option.key.value}>{option.key.label}</option>
				)
			}
		</select>

		const operatorSelect = <select
			className="gform-block__conditional-rule-operator"
			value={operator}
			onChange={updateOperator}>
			{
				this.getOperatorsForKey( key ).map( ( operator ) =>
					<option key={operator} value={operator}>{operator}</option>
				)
			}
		</select>

		const valueSelect = <select
			className="gform-block__conditional-rule-value"
			value={value}
			onChange={updateValue}>
			{
				this.getValuesForKey( key ).map( function ( value ) {

					if ( value.choices ) {

						let choices = value.choices.map( ( subvalue ) =>
							<option key={subvalue.value} value={subvalue.value}>{subvalue.label}</option>
						)

						return (<optgroup label={value.label}>
							{choices}

						</optgroup>)

					} else {

						return (<option key={value.value} value={value.value}>{value.label}</option>)
					}

				} )
			}
		</select>


		return (<div className="gform-block__conditional-rule">
			<div className="inputs">
				{keySelect}
				{operatorSelect}
				{valueSelect}
			</div>
			<div className="controls">
				<a onClick={deleteRule}><Dashicon icon="trash"/></a>
			</div>
		</div>);

	}

}