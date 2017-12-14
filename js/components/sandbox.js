const Component = wp.element.Component;

export default class Sandbox extends Component {
	constructor() {
		super( ...arguments );

		this.trySandbox = this.trySandbox.bind( this );
		this.checkMessageForResize = this.checkMessageForResize.bind( this );
		this.checkFocus = this.checkFocus.bind( this );

		this.state = {
			width: 0,
			height: 0,
		};
	}

	isFrameAccessible() {
		try {
			return !! this.iframe.contentDocument.body;
		} catch ( e ) {
			return false;
		}
	}

	checkMessageForResize( event ) {
		const iframe = this.iframe;

		// Attempt to parse the message data as JSON if passed as string
		let data = event.data || {};
		if ( 'string' === typeof data ) {
			try {
				data = JSON.parse( data );
			} catch ( e ) {} // eslint-disable-line no-empty
		}

		// Verify that the mounted element is the source of the message
		if ( ! iframe || iframe.contentWindow !== event.source ) {
			return;
		}

		// Update the state only if the message is formatted as we expect, i.e.
		// as an object with a 'resize' action, width, and height
		const { action, width, height } = data;
		const { width: oldWidth, height: oldHeight } = this.state;

		if ( 'resize' === action && ( oldWidth !== width || oldHeight !== height ) ) {
			this.setState( { width, height } );
		}
	}

	componentDidMount() {
		window.addEventListener( 'message', this.checkMessageForResize, false );
		window.addEventListener( 'blur', this.checkFocus );
		this.trySandbox();
	}

	componentDidUpdate() {
		this.trySandbox();
	}

	componentWillUnmount() {
		window.removeEventListener( 'message', this.checkMessageForResize );
		window.removeEventListener( 'blur', this.checkFocus );
	}

	checkFocus() {
		if ( this.props.onFocus && document.activeElement === this.iframe ) {
			this.props.onFocus();
		}
	}

	trySandbox() {
		if ( ! this.isFrameAccessible() ) {
			return;
		}

		const body = this.iframe.contentDocument.body;
		if ( null !== body.getAttribute( 'data-resizable-iframe-connected' ) ) {
			return;
		}

		// writing the document like this makes it act in the same way as if it was
		// loaded over the network, so DOM creation and mutation, script execution, etc.
		// all work as expected
		this.iframe.contentWindow.document.open();
		this.iframe.contentWindow.document.write( this.props.html );
		this.iframe.contentWindow.document.close();
	}

	static get defaultProps() {
		return {
			html: '',
			title: '',
		};
	}

	render() {
		return (
			<iframe
				ref={ ( node ) => this.iframe = node }
				title={ this.props.title }
				scrolling="no"
				sandbox="allow-scripts allow-same-origin allow-presentation"
				onLoad={ this.trySandbox }
				width={ Math.ceil( this.state.width ) }
				height={ Math.ceil( this.state.height ) }
				style={{ pointerEvents: 'none' }}/>
		);
	}
}