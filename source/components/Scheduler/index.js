// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

// Components
import Task from "../Task";
import Checkbox from '../../theme/assets/Checkbox';
import Spinner from './../Spinner';

export default class Scheduler extends Component {
    state = {
        newTaskMessage:  '',
        tasksFilter:     '',
        isTasksFetching: false,
        tasks:           [],
    };

    componentDidMount () {
        this._fetchTasksAsync();
    }

    // * done
    _updateTasksFilter = (e) => {
        const { value } = e.target;

        this.setState({
            tasksFilter: value.toLowerCase(),
        });
    };

    // * done
    _updateNewTaskMessage = (e) => {
        const { value: newTaskMessage } = e.target;

        this.setState({
            newTaskMessage,
        });
    };

    // * done
    _getAllCompleted = () => {
        return this.state.tasks.every(
            (task) => task.completed
        );
    };

    // * done
    _setTasksFetchingState = (isTasksFetching) => {
        this.setState({
            isTasksFetching,
        });
    };

    // * done
    _fetchTasksAsync = async () => {
        try {
            this._setTasksFetchingState(true);
            this.setState({
                tasks: await api.fetchTasks(),
            });
            this._setTasksFetchingState(false);
        } catch (error) {
            console.error(error);
        }
    };

    // * done
    _createTaskAsync = async (e) => {
        const { newTaskMessage } = this.state;

        e.preventDefault();
        if (newTaskMessage !== '') {
            try {
                this._setTasksFetchingState(true);
                const taskApi = await api.createTask(newTaskMessage);

                this.setState((prevState) => ({
                    tasks:          [taskApi, ...prevState.tasks],
                    newTaskMessage: '',
                }));
                this._setTasksFetchingState(false);
            } catch (error) {
                console.error(error);
            }
        } else {
            return null;
        }
    };

    // * done
    _updateTaskAsync = async (t) => {
        this._setTasksFetchingState(true);
        await api.updateTask(t);
        this._setTasksFetchingState(false);
    };

    // * done
    _removeTaskAsync = async (id) => {
        try {
            this._setTasksFetchingState(true);
            await api.removeTask(id);
            this.state.tasks = '';
            this._setTasksFetchingState(false);
        } catch (error) {
            console.error(error);
        }
    };

    // * done
    _completeAllTasksAsync = async () => {
        const notCompleted = this.state.tasks.filter((task) => !task.completed);

        if (notCompleted.length !== 0) {
            try {
                this._setTasksFetchingState(true);
                await api.completeAllTasks(notCompleted.map((task) => task.completed = true));
                this.setState(({ tasks }) => ({
                    tasks: tasks.map((task) => {
                        task.completed = true;

                        // Без return ввернет масив свойств.
                        return task;
                    }),
                }));
                this._setTasksFetchingState(false);
            } catch (error) {
                console.error(error);
            }
        } else {
            return null;
        }
    };

    render () {
        const { newTaskMessage, tasksFilter, isTasksFetching, tasks } = this.state;
        const tasksJSX = tasks.map((task) => (
            <Task
                key = { task.id }
                { ...task }
                _removeTaskAsync = { this._removeTaskAsync }
                _updateTaskAsync = { this._updateTaskAsync }
            />
        ));

        return (
            <section className = { Styles.scheduler } >
                <Spinner isSpinning = { isTasksFetching } />
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            placeholder = 'Поиск'
                            type = 'search'
                            value = { tasksFilter }
                            onChange = { this._updateTasksFilter }
                        />
                    </header>
                    <section>
                        <form onSubmit = { this._createTaskAsync }>
                            <input
                                maxLength = { 50 }
                                placeholder = { 'Описaние моей новой задачи' }
                                type = 'text'
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                            />
                            <button>
                                Добавить задачу
                            </button>
                        </form>
                        <div>
                            <ul>
                                { tasksJSX }
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            className = { Styles.completeAllTasks }
                            color1 = '#363636'
                            color2 = '#fff'
                            onClick = { this._completeAllTasksAsync }
                        />
                        <span className = { Styles.completeAllTasks } >Все задачи выполнены</span>
                    </footer>
                </main>
            </section>
        );
    }
}
