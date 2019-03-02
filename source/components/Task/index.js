// Core
import React, { PureComponent } from 'react';

// Instruments
import Styles from './styles.m.css';
import Checkbox from '../../theme/assets/Checkbox';
import Star from '../../theme/assets/Star';
import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';
import { string, bool, func } from 'prop-types';

export default class Task extends PureComponent {
    static propTypes = {
        _removeTaskAsync: func.isRequired,
        _updateTaskAsync: func.isRequired,
        completed:        bool.isRequired,
        favorite:         bool.isRequired,
        id:               string.isRequired,
        message:          string.isRequired,
    }

    state = {
        isTaskEditing: false,
        newMessage:    this.props.message,
        completed:     false,
    }

    taskInput = React.createRef();

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

    _setTaskEditingState = (isTaskEditing) => {
        const input = this.taskInput.current;

        if (isTaskEditing) {
            input.disabled = !isTaskEditing;
            input.focus();
        }

        this.setState({ isTaskEditing });
    };

    _updateNewTaskMessage = (event) => {
        const { value: newMessage } = event.target;

        this.setState({
            newMessage,
        });
    }

    _updateTask = () => {
        const { newMessage } = this.state;
        const { message, _updateTaskAsync } = this.props;

        if (newMessage !== message) {
            _updateTaskAsync(this._getTaskShape({ 'message': newMessage }));
            this._setTaskEditingState(false);
        }
        this._setTaskEditingState(false);

        return null;
    }

    _updateTaskMessageOnClick = () => {
        const { isTaskEditing, newMessage } = this.state;

        if (isTaskEditing) {
            if (newMessage.trim()) {
                this._cancelUpdatingTaskMessage();
            }
        }
        this._setTaskEditingState(true);
    }

    _cancelUpdatingTaskMessage = () => {
        const { message } = this.props;

        this.setState({
            isTaskEditing: false,
            newMessage:    message,
        });
    }

    _updateTaskMessageOnKeyDown = (event) => {
        const { newMessage } = this.state;

        if (newMessage.trim()) {

            if (event.key === 'Enter') {
                this._updateTask();
            } else if (event.key === 'Escape') {
                this._cancelUpdatingTaskMessage();
            }

        } else {
            return null;
        }
    }

    _toggleTaskCompletedState = () => {
        const { _updateTaskAsync, completed } = this.props;

        _updateTaskAsync(
            this._getTaskShape({ completed: !completed })
        );
    }

    _toggleTaskFavoriteState = () => {
        const { _updateTaskAsync, favorite } = this.props;

        _updateTaskAsync(
            this._getTaskShape({ 'favorite': !favorite })
        );
    }

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;

        _removeTaskAsync(id);

    }

    render () {
        const { newMessage, isTaskEditing } = this.state;
        const { completed, favorite } = this.props;

        return (
            <>
                <li className = { Styles.task }>
                    <div className = { Styles.content }>
                        <Checkbox
                            inlineBlock
                            checked = { completed }
                            className = { Styles.toggleTaskCompletedState }
                            color1 = '#3B8EF3'
                            color2 = '#FFF'
                            onClick = { this._toggleTaskCompletedState }
                        />
                        <input
                            disabled = { !isTaskEditing }
                            maxLength = { 50 }
                            ref = { this.taskInput }
                            type = 'text'
                            value = { newMessage }
                            onChange = { this._updateNewTaskMessage }
                            onKeyDown = { this._updateTaskMessageOnKeyDown }
                        />
                    </div>
                    <div className = { Styles.actions }>
                        <Star
                            inlineBlock
                            checked = { favorite }
                            className = { Styles.toggleTaskFavoriteState }
                            color1 = '#3B8EF3'
                            color2 = '#000'
                            onClick = { this._toggleTaskFavoriteState }
                        />
                        <Edit
                            inlineBlock
                            checked = { isTaskEditing }
                            className = { Styles.updateTaskMessageOnClick }
                            color1 = '#3B8EF3'
                            color2 = '#000'
                            onClick = { this._updateTaskMessageOnClick }
                        />
                        <Remove
                            inlineBlock
                            className = { Styles.removeTask }
                            color1 = '#3B8EF3'
                            color2 = '#000'
                            onClick = { this._removeTask }
                        />
                    </div>
                </li>
            </>
        );
    }
}
