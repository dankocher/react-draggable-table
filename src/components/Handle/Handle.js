import React from "react";
import './styles.scss';
import PropTypes from "prop-types";

const Handle = props => {
    let size = props.size || 30;
    let className = props.className !== undefined ? " " + props.className : "";

    return (<div className={`--handle-${size}${className}${props.display === false ? ' -none' : ''}`}/>);
};

Handle.propTypes = {
    size: PropTypes.number,
    className: PropTypes.string,
    display: PropTypes.bool
};

export default Handle;