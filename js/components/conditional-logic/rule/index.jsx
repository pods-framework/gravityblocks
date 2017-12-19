const Component = wp.element.Component;
const { Dashicon } = wp.components;

export default class Rule extends Component {

	constructor() {

		super( ...arguments );

	}

	render() {

		return (<div className="gform-block__conditional-rule">
			<div className="inputs">
				<select>
					<option>User</option>
				</select>
				<select>
					<option>is</option>
					<option>is not</option>
				</select>
				<select>
					<option>Logged In</option>
					<option>Logged Out</option>
					<optgroup label="Roles">
						<option>Administrator</option>
						<option>Editor</option>
						<option>Subscriber</option>
						<option>Contributor</option>
					</optgroup>
				</select>
			</div>
			<div className="controls">
				<Dashicon icon="trash"/>
			</div>
		</div>);

	}

}