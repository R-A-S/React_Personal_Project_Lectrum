// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

// Components
import Task from "../Task";
import Checkbox from '../../theme/assets/Checkbox';

export default class Scheduler extends Component {
    state = {
        newTaskMessage:  '',
        tasksFilter:     '',
        isTasksFetching: false,
        tasks:           [],
    };

    componentDidMount () {

    }

    _updateTasksFilter (e) {
        const { value } = e.target;

        this.setState({
            tasksFilter: value.toLowerCase(),
        });
    }

    _updateNewTaskMessage (e) {
        const { value } = e.target;

        this.setState({
            newTaskMessage: value,
        });
    }

    _getAllCompleted () {
        this.state.tasks.every((t) => t.completed);
    }

    _setTasksFetchingState (isTasksFetching) {
        this.setState({
            isTasksFetching,
        });
    }

    _fetchTasksAsync () {

    }

    _createTaskAsync () {

    }

    _updateTaskAsync () {

    }

    _removeTaskAsync () {

    }

    _completeAllTasksAsync () {

    }

    render () {
        return (
            <section className = { Styles.scheduler }>
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input placeholder = 'Поиск' type = 'search' value = '' />
                    </header>
                    <section>
                        <form >
                            <input placeholder = { 'Описaние моей новой задачи' } type = 'text' />
                            <button>Добавить задачу</button>
                        </form>
                        <div>
                            <ul>
                                <Task />
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            color1 = '#363636'
                            color2 = '#fff'
                            className = { Styles.completeAllTasks }
                        />
                        <span className = { Styles.completeAllTasks } >Все задачи выполнены</span>
                    </footer>
                </main>
            </section>
        );
    }
}
