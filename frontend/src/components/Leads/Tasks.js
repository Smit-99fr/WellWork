import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getTasks,
    addTask,
    deleteTask,
    updateTask,
    requestExtension,
    approveExtension,
    rejectExtension,
    getExtensionRequests
} from '../../actions/tasks';
import { fetchTeams } from '../../actions/team';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';

const Tasks = () => {
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.tasks.tasks);
    const teams = useSelector(state => state.teamReducer.teams);
    const extensionRequests = useSelector(state => state.tasks.extensionRequests);
    const user = useSelector((state) => state.auth.user);
    const isTeamLeader = useSelector(state => state.auth.user?.profile?.is_team_leader);

    const [newTask, setNewTask] = useState({
        task_name: '',
        due_date: '',
        assigned_to: '',
        priority: 'low',
        status: 'not_started'
    });
    const [editTask, setEditTask] = useState({
        task_name: '',
        due_date: '',
        assigned_to: '',
        priority: 'low',
        status: 'not_started'
    });
    const [newDueDate, setNewDueDate] = useState('');
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);
    const [editTaskId, setEditTaskId] = useState(null); // Track editing task
    const [extensionReason, setExtensionReason] = useState('');
    const [expectedCompletionDate, setExpectedCompletionDate] = useState('');
    const [visibleExtensionFormTaskId, setVisibleExtensionFormTaskId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [viewRequestStatus, setViewRequestStatus] = useState(false); // Track request status view

    useEffect(() => {
        dispatch(getTasks());
        if (isTeamLeader) {
            dispatch(fetchTeams());
            dispatch(getExtensionRequests());
        }
    }, [dispatch, isTeamLeader]);

    const handleAddTask = () => {
        dispatch(addTask(newTask));
        setNewTask({
            task_name: '',
            due_date: '',
            assigned_to: '',
            priority: 'low',
            status: 'not_started'
        });
        setIsAddFormVisible(false);
    };

    const handleEditTask = (taskId) => {
        dispatch(updateTask(taskId, editTask));
        setEditTaskId(null);
    };

    const handleDeleteTask = (taskId) => {
        dispatch(deleteTask(taskId));
    };

    const handleAddFormChange = (e) => {
        setNewTask({ ...newTask, [e.target.name]: e.target.value });
    };

    const handleEditFormChange = (e) => {
        setEditTask({ ...editTask, [e.target.name]: e.target.value });
    };

    const handleClickEdit = (task) => {
        setEditTask({
            task_name: task.task_name,
            due_date: task.due_date,
            assigned_to: task.assigned_to?.username || '',
            priority: task.priority,
            status: task.status
        });
        setEditTaskId(task.id);
    };

    const handleRequestExtension = (taskId) => {
        dispatch(requestExtension(taskId, extensionReason, expectedCompletionDate));
        setExtensionReason('');
        setExpectedCompletionDate('');
        setVisibleExtensionFormTaskId(null);
    };

    const handleApproveExtension = (taskId, newDueDate) => {
        dispatch(approveExtension(taskId, newDueDate));
    };

    const handleRejectExtension = (taskId) => {
        dispatch(rejectExtension(taskId));
    };

    const handleStatusChange = (taskId, e) => {
        const updatedTask = { ...tasks.find(task => task.id === taskId), status: e.target.value };
        dispatch(updateTask(taskId, updatedTask));
    };

    // Color scheme for task status sections
    const statusColors = {
        not_started: '#f0ad4e', // Yellow for Not Started
        in_progress: '#5bc0de', // Blue for In Progress
        completed: '#5cb85c' // Green for Completed
    };

    // Color scheme for task priority
    const priorityColors = {
        low: '#dff0d8', // Light green for Low
        medium: '#fcf8e3', // Light yellow for Medium
        high: '#f2dede' // Light red for High
    };

    return (
        <Container>
            <Row>
                <Col>
                    {isTeamLeader ? <Button onClick={() => setIsAddFormVisible(!isAddFormVisible)}>
                        {isAddFormVisible ? 'Hide Add Task Form' : 'Add New Task'}
                    </Button> : ''}

                </Col>

                {/* View Request Status Button for Non-Leaders */}
                {!isTeamLeader && (
                    <Col className="text-right">
                        <Button onClick={() => setViewRequestStatus(!viewRequestStatus)}>
                            {viewRequestStatus ? 'Hide Request Status' : 'View Request Status'}
                        </Button>
                    </Col>
                )}
            </Row>

            {/* Extension Request Status Dropdown for Non-Leaders */}
            {viewRequestStatus && !isTeamLeader && (
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>Submitted Extension Requests</Card.Title>
                                {/* {extensionRequests
                                    .filter(request => request.user === user.id)
                                    .map(request => (
                                        <Card.Text key={request.id}>
                                            Task: {request.task_name} - Status: {request.approved ? 'Approved' : 'Rejected'}
                                        </Card.Text>
                                    ))} */}
                                {tasks.map(task => (
                                    task.extension_requests.map(request => (
                                        <Card.Text key={request.id}>
                                            Task: {task.task_name} - Status: {request ? request.approved ? 'Approved' : 'Rejected' : 'un-checked'}
                                        </Card.Text>
                                    ))
                                ))

                                }
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {isAddFormVisible && (
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Form>
                                    <Form.Group controlId="formTaskName">
                                        <Form.Label>Task Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="task_name"
                                            value={newTask.task_name}
                                            onChange={handleAddFormChange}
                                            placeholder="Enter task name"
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="formDueDate">
                                        <Form.Label>Due Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="due_date"
                                            value={newTask.due_date}
                                            onChange={handleAddFormChange}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="formAssignedTo">
                                        <Form.Label>Assign To</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="assigned_to"
                                            value={newTask.assigned_to}
                                            onChange={handleAddFormChange}
                                        >
                                            <option value="">Select a user</option>
                                            {teams.map(team =>
                                                team.members.map(member => (
                                                    <option key={member.id} value={member.id}>
                                                        {member.username}
                                                    </option>
                                                ))
                                            )}
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group controlId="formPriority">
                                        <Form.Label>Priority</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="priority"
                                            value={newTask.priority}
                                            onChange={handleAddFormChange}
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </Form.Control>
                                    </Form.Group>

                                    <Button variant="primary" onClick={handleAddTask}>
                                        Add Task
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            <Row>
                {['not_started', 'in_progress', 'completed'].map(status => (
                    <Col key={status} md={12} className="mb-4">
                        <Card style={{ backgroundColor: statusColors[status] }}>
                            <Card.Header>{status.replace('_', ' ').toUpperCase()}</Card.Header>
                            <Card.Body>
                                <Row>
                                    {tasks.filter(task => task.status === status).map(task => (
                                        <Col key={task.id} md={4}>
                                            <Card style={{ backgroundColor: priorityColors[task.priority] }}>
                                                <Card.Body>
                                                    <Card.Title>{task.task_name}</Card.Title>
                                                    <Card.Text>Due Date: {task.due_date}</Card.Text>
                                                    <Card.Text>Assigned To: {task.assigned_to?.username}</Card.Text>
                                                    <Card.Text>Priority: {task.priority}</Card.Text>
                                                    <Card.Text>Status: {task.status}</Card.Text>

                                                    {/* Status change visible only to non-leaders */}
                                                    {!isTeamLeader && (
                                                        <Form.Group controlId={`status-${task.id}`}>
                                                            <Form.Label>Status</Form.Label>
                                                            <Form.Control
                                                                as="select"
                                                                value={task.status}
                                                                onChange={(e) => handleStatusChange(task.id, e)}
                                                            >
                                                                <option value="not_started">Not Started</option>
                                                                <option value="in_progress">In Progress</option>
                                                                <option value="completed">Completed</option>
                                                            </Form.Control>
                                                        </Form.Group>
                                                    )}

                                                    {/* Task edit/delete for leaders */}
                                                    {isTeamLeader && (
                                                        <>
                                                            <Button onClick={() => handleClickEdit(task)}>
                                                                Edit
                                                            </Button>
                                                            <Button variant="danger" onClick={() => handleDeleteTask(task.id)}>
                                                                Delete
                                                            </Button>
                                                        </>
                                                    )}

                                                    {/* Non-leaders request task extension */}
                                                    {(!isTeamLeader && task.extension_requests.length <= 1) && (
                                                        <>
                                                            <Button
                                                                onClick={() =>
                                                                    setVisibleExtensionFormTaskId(
                                                                        visibleExtensionFormTaskId === task.id ? null : task.id
                                                                    )
                                                                }
                                                            >
                                                                {visibleExtensionFormTaskId === task.id
                                                                    ? 'Hide Extension Form'
                                                                    : 'Request Extension'}
                                                            </Button>
                                                            {visibleExtensionFormTaskId === task.id && (
                                                                <Form>
                                                                    <Form.Group controlId="extensionReason">
                                                                        <Form.Label>Reason for Extension</Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            value={extensionReason}
                                                                            onChange={(e) => setExtensionReason(e.target.value)}
                                                                        />
                                                                    </Form.Group>
                                                                    <Form.Group controlId="expectedCompletionDate">
                                                                        <Form.Label>Expected Completion Date</Form.Label>
                                                                        <Form.Control
                                                                            type="date"
                                                                            value={expectedCompletionDate}
                                                                            onChange={(e) => setExpectedCompletionDate(e.target.value)}
                                                                        />
                                                                    </Form.Group>
                                                                    <Button onClick={() => handleRequestExtension(task.id)}>
                                                                        Submit Extension Request
                                                                    </Button>
                                                                </Form>
                                                            )}
                                                        </>
                                                    )}

                                                    {/* Team leader approves/rejects extension */}
                                                    {isTeamLeader && extensionRequests.some(req => req.task === task.id) && (
                                                        <div>
                                                            <Form.Group controlId={`newDueDate-${task.id}`}>
                                                                <Form.Label>Approve New Due Date</Form.Label>
                                                                <Form.Control
                                                                    type="date"
                                                                    value={newDueDate}
                                                                    onChange={(e) => setNewDueDate(e.target.value)}
                                                                />
                                                            </Form.Group>
                                                            <Button onClick={() => handleApproveExtension(task.id, newDueDate)}>
                                                                Approve Extension
                                                            </Button>
                                                            <Button onClick={() => handleRejectExtension(task.id)}>
                                                                Reject Extension
                                                            </Button>
                                                        </div>
                                                    )}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Tasks;
