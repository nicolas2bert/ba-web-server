import React from 'react';

const Loading = props => {
    if (props.loading) {
        return (<div> loading... </div>);
    }
    return props.children;
};

export default Loading;
