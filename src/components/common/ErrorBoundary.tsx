/* eslint-disable no-console */
import { Component } from 'react';

interface ErrorBoundaryProps {
	fallback?: () => void;
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
		try {
			this.props.fallback?.();
			console.log({ error, errorInfo });
		} catch (e) {
			//
		}
	}

	render() {
		if (this.state.hasError) {
			return null;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
