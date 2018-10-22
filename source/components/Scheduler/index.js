// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import { sortTasksByGroup } from '../../instruments';
import FlipMove from 'react-flip-move';

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
                tasks: sortTasksByGroup(await api.fetchTasks()),
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
                    tasks:          sortTasksByGroup([taskApi, ...prevState.tasks]),
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

        const taskApi = await api.updateTask(t);

        const indexToReplace = this.state.tasks.findIndex((task) => task.id === taskApi.id);

        this.setState((prevState) => ({
            tasks: sortTasksByGroup(prevState.tasks.map((task, i) => i === indexToReplace ? taskApi : task)),
        }));
        this._setTasksFetchingState(false);
    };

    // * done
    _removeTaskAsync = async (id) => {
        try {
            this._setTasksFetchingState(true);
            await api.removeTask(id);
            this.setState((prevState) => ({
                tasks: prevState.tasks.filter((task) => task.id !== id),
            }));
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
                const completedTasks = notCompleted.map((task) => {
                    task.completed = true;

                    return task; // Без return ввернет масив свойств.
                });

                await api.completeAllTasks(completedTasks);
                this.setState(({ tasks }) => ({
                    tasks: tasks.map((task) => {
                        task.completed = true;

                        return task; // Без return ввернет масив свойств.
                    }),
                }));
                this._setTasksFetchingState(false);
            } catch (error) {
                console.error(error);
            }
        } else {
            //!If need toggle complete all
            // this._setTasksFetchingState(true);
            // await api.completeAllTasks(this.state.tasks.map((task) => task.completed = false));
            // this.setState(({ tasks }) => ({
            //     tasks: tasks.map((task) => {
            //         task.completed = false;
            //         return task;
            //     }),
            // }));
            // this._setTasksFetchingState(false);
            //!end If
            return null;
        }
    };

    render () {
        const { newTaskMessage, tasksFilter, isTasksFetching, tasks } = this.state;
        const tasksJSX = tasks.filter((task) => task.message.toLocaleLowerCase()
            .includes(tasksFilter))
            .map((task) => (
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
                                className = 'createTask'
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
                        <div className = 'overlay' >
                            <ul>
                                <FlipMove
                                    duration = { 400 }
                                    easing = { 'ease-in-out' }>
                                    { tasksJSX }
                                </FlipMove>
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            checked = { this._getAllCompleted() }
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
