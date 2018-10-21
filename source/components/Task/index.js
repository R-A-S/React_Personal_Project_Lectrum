// Core
import React, { PureComponent, createRef } from 'react';

// Instruments
import Styles from './styles.m.css';
import Checkbox from '../../theme/assets/Checkbox';
import Star from "../../theme/assets/Star";
import Edit from "../../theme/assets/Edit";
import Remove from "../../theme/assets/Remove";

export default class Task extends PureComponent {
    constructor (props) {
        super(props);
        this.taskInput = createRef();
    }

    state = {
        isTaskEditing: false,
        newMessage:    '',
        completed:     false,

    }
    
    // * done
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

    // * done
    _setTaskEditingState = (isTaskEditing) => {
        if (isTaskEditing) {
            this.setState({
                isTaskEditing,
            });
            this.taskInput.current.focus();
        }
    }

    // * done
    _updateNewTaskMessage = (event) => {
        const { value: newMessage } = event.target;

        this.setState({
            newMessage,
        });
    }

    // * done
    _updateTask = () => {
        if (this.state.newMessage === this.props.message) {
            this._setTaskEditingState(false);

            return null;
        }
        this._setTaskEditingState(false);
        this.props._updateTaskAsync(this._getTaskShape({ 'message': this.state.newMessage }));
    }

    // * done
    _updateTaskMessageOnClick = () => {
        if (!this.state.isTaskEditing) {

            this._setTaskEditingState(true);

        } else {
            this._updateTask();

            return null;
        }
    }

    // * done
    _cancelUpdatingTaskMessage = () => {
        this.setState({
            isTaskEditing: false,
            newMessage:    this.props.message,
        });
    }

    // * done
    _updateTaskMessageOnKeyDown = (event) => {
        if (this.state.newMessage !== '') {
            if (event.key === 'Enter') {
                this._updateTask();
            } else if (event.key === 'Escape') {
                this._cancelUpdatingTaskMessage();
            }
        } else {
            return null;
        }
    }

    // * done
    _toggleTaskCompletedState = () => {
        this.props._updateTaskAsync(
            this._getTaskShape({ 'completed': !this.props.completed })
        );
    }

    // * done
    _toggleTaskFavoriteState = () => {
        this.props._updateTaskAsync(
            this._getTaskShape({ 'favorite': !this.props.favorite })
        );
    }

    // * done
    _removeTask = () => {
        this.props._removeTaskAsync(this.props.id);

    }

    render () {
        const { newMessage, isTaskEditing } = this.state;
        const { completed, favorite } = this.props;

        return (
            <>
                <li className = { Styles.task }>
                    <div className = { Styles.content }>
                        <Checkbox
                            checked = { completed }
                            className = { Styles.toggleTaskCompletedState }
                            color1 = '#3B8EF3'
                            color2 = '#FFF'
                            inlineBlock
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
