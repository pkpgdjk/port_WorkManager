import React, {Component} from 'react';
import PropTypes from 'prop-types';

class root extends Component {
    render() {
        return (
            <div>
                <h1>Root</h1>
                {this.props.children}
            </div>
        );
    }
}

root.propTypes = {};
root.defaultProps = {};

export default root;
