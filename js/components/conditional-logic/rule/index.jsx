const { __ } = wp.i18n;
const Component = wp.element.Component;
const { Dashicon, DateTimePicker, Dropdown } = wp.components;
const { dateI18n, settings } = wp.date;

export default class Rule extends Component {

	constructor() {

		super( ...arguments );

	}

	updateKey( key ) {

		let rule = this.props.rule;

		rule.key = key;
		rule.value = '';

		this.props.updateRule( rule, this.props.index );

	}

	updateOperator( operator ) {

		let rule = this.props.rule;

		rule.operator = operator;

		this.props.updateRule( rule, this.props.index );

	}

	updateValue( value ) {

		let rule = this.props.rule;

		rule.value = value;
		this.props.updateRule( rule, this.props.index );

	}

	getOperators() {

		let { key } = this.props.rule,
			options = gform.conditionalOptions;

		for ( let i = 0; i < options.length; i++ ) {

			if ( options[ i ].key.value !== key && key ) {
				continue;
			}

			return options[ i ].operators;

		}

		return [];

	}

	getValue() {

		let { key } = this.props.rule,
			options = gform.conditionalOptions;

		for ( let i = 0; i < options.length; i++ ) {

			if ( options[ i ].key.value !== key && key ) {
				continue;
			}

			return options[ i ].value;

		}

		return [];

	}

	getValueInput() {

		let { value } = this.props.rule;
		const index = this.props.index;

		const valueProps = this.getValue();
		const updateValue = ( e ) => this.updateValue( e.target.value );

		switch ( valueProps.type ) {

			case 'date':

				const updateDateValue = ( newDate ) => this.updateValue( newDate );
				const is12HourTime = /a(?!\\)/i.test(
					settings.formats.time
						.toLowerCase() // Test only the lower case a
						.replace( /\\\\/g, '' ) // Replace "//" with empty strings
						.split( '' ).reverse().join( '' ) // Reverse the string and test for "a" not followed by a slash
				);

				return (
					<Dropdown
						key={`gform-block__conditional-rule-${index}-value`}
						position="bottom left"
						contentClassName="gform-block__conditional-rule-value-popover"
						className="gform-block__conditional-rule-value"
						renderToggle={( { onToggle, isOpen } ) => (
							<button
								type="button"
								className="button-link"
								onClick={onToggle}
								aria-expanded={isOpen}
							>
								{value ? dateI18n( settings.formats.datetime, value ) : __( 'Select a Date', 'gravityforms' )}
							</button>
						)}
						renderContent={() => [
							<DateTimePicker
								key="date-time-picker"
								currentDate={value}
								onChange={updateDateValue}
								locale={settings.l10n.locale}
								is12Hour={is12HourTime}
							/>
						]}
					/>

				);

			case 'select':
				return (<select
					key={`gform-block__conditional-rule-${index}-value`}
					className="gform-block__conditional-rule-value"
					value={value}
					onChange={updateValue}>
					{
						this.getValue().choices.map( function ( value ) {

							if ( value.choices ) {

								let choices = value.choices.map( ( subvalue ) =>
									<option key={subvalue.value} value={subvalue.value}>{subvalue.label}</option>
								)

								return (<optgroup label={value.label} key={value.label}>
									{choices}
								</optgroup>)

							} else {

								return (<option key={value.value} value={value.value}>{value.label}</option>)

							}

						} )
					}
				</select>);

			default:

				return (
					<input
						key={`gform-block__conditional-rule-${index}-value`}
						className="gform-block__conditional-rule-value"
						value={value}
						onChange={updateValue}
					/>
				);

		}

	}

	render() {

		let { key, operator } = this.props.rule;
		const index = this.props.index;
		const options = this.props.options;

		const deleteRule = () => this.props.deleteRule( index );

		const updateKey = ( e ) => this.updateKey( e.target.value );
		const updateOperator = ( e ) => this.updateOperator( e.target.value );

		const keySelect = <select
			key={`gform-block__conditional-rule-${index}-key`}
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
			key={`gform-block__conditional-rule-${index}-operator`}
			className="gform-block__conditional-rule-operator"
			value={operator}
			onChange={updateOperator}>
			{
				this.getOperators().map( ( operator ) =>
					<option key={operator.value} value={operator.value}>{operator.label}</option>
				)
			}
		</select>

		return (<div className="gform-block__conditional-rule">
			<div className="gform-block__conditional-rule-inputs">
				{keySelect}
				{operatorSelect}
				{this.getValueInput()}
			</div>
			<div className="gform-block__conditional-rule-controls">
				<span className="gform-block__conditional-rule-delete" onClick={deleteRule}>
					<Dashicon
						key={`gform-block__conditional-rule-delete-${index}`}
						icon="trash"
					/>
				</span>
			</div>
		</div>);

	}

}