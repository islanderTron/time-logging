/*
  eslint-disable react/prefer-stateless-function, react/jsx-boolean-value,
  no-undef, jsx-a11y/label-has-for
*/
class TimersDashboard extends React.Component {
    state = {
        timers: [
            {
                title: 'Practice squat',
                project: 'Gym Chores',
                id: uuid.v4(),
                elapsed: 5443999,
                runningSince: Date.now(),
            },
            {
                title: 'Bake squat',
                project: 'Kitchen Chores',
                id: uuid.v4(),
                elapsed: 1237399,
                runningSince: null,
            },
        ],
    };

    handleCreateFormSubmit = (timer) => {
        this.createTimer(timer);
    };

    handleEditFormSubmit = (attrs) => {
        this.updateTimer(attrs);
    };

    handleTrashClick = (timerId) => {
        this.deleteTimer(timerId);
    };

    createTimer = (timer) => {
        const t = helpers.newTimer(timer);
        this.setState({
            timers: this.state.timers.concat(t),
        });
    };

    updateTimer = (attrs) => {
        this.setState({
            timers: this.state.timers.map((timer) => {
                if(timer.id ===attrs.id) {
                    return Object.assign({}, timer, {
                        title:attrs.title,
                        project: attrs.project
                    });
                } else {
                    return timer;
                }
            }),
        });
    };

    deleteTimer = (timerId) => {
        this.setState({
            timers: this.state.timers.filter(t => t.id !== timerId),
        });
    };

    render() {
        return (
            <div className='ui three column centered grid'>
                <div className='column'>
                    <EditableTimerList
                        timers={this.state.timers}
                        onFormSubmit={this.handleEditFormSubmit}
                        onTrashClick={this.handleTrashClick}
                    />
                    <ToggleableTimerForm 
                        onFormSubmit={this.handleCreateFormSubmit}
                    />
                </div>
            </div>
        );
    }

}
  
class ToggleableTimerForm extends React.Component {
    state = {
        isOpen: false,
    };
    // Add handle event to open
    handleFormOpen = () => {
        this.setState({isOpen: true});
    };

    handleFormClose = () => {
        this.setState({isOpen:false});
    };

    handleSubmit = (timer) => {
        this.props.onFormSubmit(timer);
        this.setState({isOpen:false});
    };

    handleEditFormSubmit = (attrs) => {
        this.updateTimer(attrs);
    };

    render() {
        if(this.state.isOpen) {
            return (
                <TimerForm
                    onFormSubmit={this.handleSubmit} 
                    onFormClose={this.handleFormClose} />
            );
        } else { 
            return( 
                <div className='ui basic content center aligned segment'>
                    <button
                        className='ui basic button icon'
                        onClick={this.handleFormOpen}
                    >
                        <i className='plus icon' />
                    </button>
                </div>
            );
        }
    }
}
 
// Declares 2 components, each which have props corresponding to a given timer's properties
class EditableTimerList extends React.Component {
    render() {
        const timers = this.props.timers.map((timer) => (
            <EditableTimer 
                key={timer.id}
                id={timer.id}
                title={timer.title}
                project={timer.project}
                elapsed={timer.elapsed}
                runningSince={timer.runningSince}
                onFormSubmit={this.props.onFormSubmit}
                onTrashClick={this.props.onTrashClick}
            />
        ));
        return( 
            <div id='timers'>
                {timers}
            </div>
        );
    }
}

class EditableTimer extends React.Component {
    state = {
        editFormOpen: false,
    };

    handleEditClick = () => {
        this.openForm();
    };

    handleFormClose = () => {
        this.closeForm();
    };

    handleSubmit = (timer) => {
        this.props.onFormSubmit(timer);
        this.closeForm();
    };

    closeForm = () => {
        this.setState({ editFormOpen:false });
    };

    openForm = () => {
        this.setState({ editFormOpen: true });
    };

    render() {
        // Use the prop editFormOpen
        // If editFormOpen is true, move to TimeForm to create/update form
        if (this.state.editFormOpen) {
            return (
                <TimerForm
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    onFormSubmit={this.handleSubmit}
                    onFormClose={this.handleFormClose}
                />
            );
        // If editFormOpen is false, move to Timer
        } else {
            return (
                <Timer
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    elapsed={this.props.elapsed}
                    runningSince={this.props.runningSince}
                    onEditClick={this.handleEditClick}
                    onTrashClick={this.props.onTrashClick}
                />
            );
        }
    }
}

// This uses all the props for a timer
class Timer extends React.Component {
    handleTrashClick = () => {
        this.props.onTrashClick(this.props.id);
    };
    render() {
        const elapsedString = helpers.renderElapsedString(this.props.elapsed);

        return (
        <div className='ui centered card'>
            <div className='content'>
                <div className='header'>
                    {this.props.title}
                </div>
                <div className='meta'>
                    {this.props.project}
                </div>
                <div className='center aligned description'>
                    <h2>
                    {elapsedString}
                    </h2>
                </div>
                <div className='extra content'>
                    <span className='right floated edit icon'
                          onClick={this.props.onEditClick} 
                    >
                    <i className='edit icon' />
                    </span>
                    <span className='right floated trash icon'
                          onClick={this.handleTrashClick}>
                    <i className='trash icon' />
                    </span>
                </div>
            </div>
            <div className='ui bottom attached blue basic button'>
            Start
            </div>
        </div>
        );
    }
}

// Has 2 interactive input fields: 1 for title & 1 for project
class TimerForm extends React.Component {
    state = {
        title: this.props.title || '',
        project: this.props.project || '',
    };

    handleTitleChange = (e) => {
        this.setState({title: e.target.value});
    }
    handleProjectChange = (e) => {
        this.setState({project: e.target.value})
    }
    handleSubmit = () => {
        this.props.onFormSubmit({
            id:this.props.id,
            title: this.state.title,
            project: this.state.project,
        });
    };

    render() {
        const submitText = this.props.id ? 'Update' : 'Create';
        return (
        <div className='ui centered card'>
            <div className='content'>
            <div className='ui form'>
                <div className='field'>
                <label>Title</label>
                <input 
                    type='text' 
                    value={this.props.title}
                    onChange={this.handleTitleChange} />
                </div>
                <div className='field'>
                <label>Project</label>
                <input 
                    type='text' 
                    defaultValue={this.props.project} 
                    onChange={this.handleProjectChange}
                />
                </div>
                <div className='ui two bottom attached buttons'>
                <button className='ui basic blue button'
                        onClick={this.handleSubmit}>
                    {submitText}
                </button>
                <button className='ui basic red button'
                        onClick={this.props.onFormClose}>
                    Cancel
                </button>
                </div>
            </div>
            </div>
        </div>
        );
    }
}
  
ReactDOM.render(
    <TimersDashboard />,
    document.getElementById('content')
);
  