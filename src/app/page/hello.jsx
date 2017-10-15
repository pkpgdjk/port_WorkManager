import React, {Component} from 'react';
import PropTypes from 'prop-types';

class hello extends Component {
    constructor(props){
        super(props);
        console.log(props.match.params.id);
    }

    render() {
        return (
            <div>
                <h1>hello {this.props.match.params.id}</h1>
            </div>
        );
    }
}

hello.propTypes = {};
hello.defaultProps = {};

export default hello;
