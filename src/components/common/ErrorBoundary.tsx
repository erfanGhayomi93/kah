import { Component } from 'react';

interface ErrorBoundaryProps {
	hasError?: boolean;
	children?: React.ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps> {
	state: ErrorBoundaryProps;

	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error: unknown, errorInfo: unknown) {
		// eslint-disable-next-line no-console
		console.log({ error, errorInfo });
	}

	render() {
		if (this.state.hasError) {
			return (
				<div>
					<h2>Oops, there is an error!</h2>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
