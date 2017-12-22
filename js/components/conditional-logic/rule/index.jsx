const { __ } = wp.i18n;
const Component = wp.element.Component;
const { Dashicon, Dropdown } = wp.components;
const { dateI18n, settings } = wp.date;

import DatePicker from 'react-datepicker';
import moment from 'moment';

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

		const valueProps = this.getValue();
		const updateValue = ( e ) => this.updateValue( e.target.value );

		switch ( valueProps.type ) {

			case 'date':

				const momentDate = value ? moment( value ) : moment();
				const updateDateValue = ( newDate ) => this.updateValue( newDate.format( 'YYYY-MM-DD' ) );

				return (
					<Dropdown
						position="bottom left"
						className="gform-block__conditional-rule-value"
						renderToggle={ ( { onToggle, isOpen } ) => (
							<button
								type="button"
								className="button-link"
								onClick={ onToggle }
								aria-expanded={ isOpen }
							>
								{ value ? dateI18n( settings.formats.date, value ) : __( 'Select a Date', 'gravityforms' ) }
							</button>
						) }
						renderContent={ () => [
							<DatePicker
								key="date-picker"
								inline
								selected={ momentDate }
								onChange={ updateDateValue }
								locale={ settings.l10n.locale }
								dateFormat="YYYY-MM-DD"
							/>
						] }
					/>

				);

			case 'select':
				return (<select
					className="gform-block__conditional-rule-value"
					value={value}
					onChange={updateValue}>
					{
						this.getValue().choices.map( function ( value ) {

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
				</select>);

			default:

				return (<input className="gform-block__conditional-rule-value" value={value} onChange={updateValue}/>)

		}

	}

	render() {

		let { key, operator } = this.props.rule;
		const options = this.props.options;

		const deleteRule = () => this.props.deleteRule( this.props.index );

		const updateKey = ( e ) => this.updateKey( e.target.value );
		const updateOperator = ( e ) => this.updateOperator( e.target.value );

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
				<span className="gform-block__conditional-rule-delete" onClick={deleteRule}><Dashicon
					icon="trash"/></span>
			</div>
		</div>);

	}

}