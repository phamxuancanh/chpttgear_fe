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
                <div>
                    <div>
                        <div>Whoops!</div>
                        <div>
                            Stuck in a blind spot. Reload to see the magic!
                        </div>
                        <button onClick={this.props.onReset}>Reload</button>
                    </div>
                </div>
            );
        }

        return <>{this.props.children}</>;
    }
}

export default ErrorBoundary;
