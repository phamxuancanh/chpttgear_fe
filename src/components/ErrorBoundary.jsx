import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.error) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        <h1 className="text-4xl font-bold text-red-500 mb-4">Whoops!</h1>
                        <p className="text-lg text-gray-700 mb-4">
                            Something went wrong. Please try reloading the page.
                        </p>
                        <button
                            onClick={this.props.onReset}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            Reload
                        </button>
                    </div>
                </div>
            );
        }

        return <>{this.props.children}</>;
    }
}

export default ErrorBoundary;