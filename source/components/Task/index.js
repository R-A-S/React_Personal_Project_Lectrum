// Core
import React, { PureComponent } from 'react';

// Instruments
import Styles from './styles.m.css';

export default class Task extends PureComponent {
    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    render () {
        return (
            <div>
                <li className = { Styles.task }>
                    <div className = { Styles.content }></div>
                    <div className = { Styles.actions }></div>
                </li>
            </div>

        );
    }
}
