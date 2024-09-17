import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMeetings, scheduleMeeting, cancelMeeting, attendMeeting } from '../../actions/meetings';
import { fetchTeams } from '../../actions/team';
import { Button, Card, Collapse, Form, ListGroup, Container, Row, Col } from 'react-bootstrap';

const Meetings = () => {
    const dispatch = useDispatch();
    const meetings = useSelector(state => state.meetings.meetings);
    const user = useSelector(state => state.auth.user);
    const teams = useSelector(state => state.teamReducer.teams);

    const [meetingData, setMeetingData] = useState({
        title: '',
        description: '',
        scheduled_at: '',
        duration_minutes: 30,
        team_id: user.profile.team.id
    });

    const [currentMeetingLink, setCurrentMeetingLink] = useState('');
    const [showCompleted, setShowCompleted] = useState(false); // For collapsible section

    useEffect(() => {
        dispatch(fetchMeetings());
        dispatch(fetchTeams());
    }, [dispatch]);

    const handleChange = (e) => {
        setMeetingData({
            ...meetingData,
            [e.target.name]: e.target.value
        });
    };

    const handleSchedule = (e) => {
        e.preventDefault();
        dispatch(scheduleMeeting(meetingData));
    };

    const handleAttend = (meetingLink, meetingId, scheduled_at) => {
        const currentTime = new Date();
        const startTime = new Date(scheduled_at.replace('Z', ''));
        console.log(currentTime)
        console.log(startTime)

        if (currentTime >= startTime) {
            dispatch(attendMeeting(meetingId));  // Track attendance
            setCurrentMeetingLink(meetingLink);
            window.open(meetingLink, '_blank');  // Open Jitsi meeting in a new tab
        } else {
            alert('The meeting has not started yet.');
        }
    };

    const handleCancel = (meetingId) => {
        dispatch(cancelMeeting(meetingId));
    };

    const formatDateTime = (isoDateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',

            timeZone: 'UTC',
            timeZoneName: 'short'
        };
        return new Date(isoDateString).toLocaleString('en-US', options);  // Adjust locale as needed
    };

    const now = new Date();

    const scheduledMeetings = meetings.filter(meeting => {
        const meetingStart = new Date(meeting.scheduled_at.replace('Z', ''));
        return teams?.some(team => team.id === meeting.team.id) && meetingStart > now;
    });

    const ongoingMeetings = meetings.filter(meeting => {
        const meetingStart = new Date(meeting.scheduled_at.replace('Z', ''));
        const meetingEnd = new Date(meetingStart.getTime() + meeting.duration_minutes * 60000);
        return teams?.some(team => team.id === meeting.team.id) && meetingStart <= now && now < meetingEnd;
    });

    const completedMeetings = meetings.filter(meeting => {
        const meetingStart = new Date(meeting.scheduled_at.replace('Z', ''));
        const meetingEnd = new Date(meetingStart.getTime() + meeting.duration_minutes * 60000);
        return teams?.some(team => team.id === meeting.team.id) && now >= meetingEnd;
    });

    return (
        <Container>
            <h2 className="text-center mb-4">Meetings</h2>

            {user.profile.is_team_leader && (
                <Card className="mb-4 p-3">
                    <h4>Schedule a Meeting</h4>
                    <Form onSubmit={handleSchedule}>
                        <Form.Group>
                            <Form.Control
                                type="text"
                                name="title"
                                value={meetingData.title}
                                placeholder="Meeting Title"
                                onChange={handleChange}
                                required
                                className="mb-2"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={meetingData.description}
                                placeholder="Description"
                                onChange={handleChange}
                                required
                                className="mb-2"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                                type="datetime-local"
                                name="scheduled_at"
                                value={meetingData.scheduled_at}
                                onChange={handleChange}
                                required
                                className="mb-2"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                                type="number"
                                name="duration_minutes"
                                value={meetingData.duration_minutes}
                                onChange={handleChange}
                                placeholder="Duration (minutes)"
                                required
                                className="mb-2"
                            />
                        </Form.Group>
                        <Button type="submit" variant="primary" className="w-100">Schedule Meeting</Button>
                    </Form>
                </Card>
            )}

            <Row>
                <Col>
                    <Card className="mb-4 p-3" style={{ backgroundColor: '#f8f9fa' }}>
                        <h3 className="text-primary">Scheduled Meetings</h3>
                        <ListGroup>
                            {scheduledMeetings.map(meeting => (
                                <ListGroup.Item key={meeting.id}>
                                    <h4>{meeting.title}</h4>
                                    <p>{meeting.description}</p>
                                    <p>Scheduled by: {meeting.scheduled_by.username}</p>
                                    <p>Time: {formatDateTime(meeting.scheduled_at)}</p>
                                    {user.profile.is_team_leader && (
                                        <Button variant="danger" onClick={() => handleCancel(meeting.id)} className="me-2">Cancel</Button>
                                    )}
                                    <Button disabled>The meeting hasn't started yet</Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </Col>
                <Col>
                    <Card className="mb-4 p-3" style={{ backgroundColor: '#e9f7ef' }}>
                        <h3 className="text-success">Ongoing Meetings</h3>
                        <ListGroup>
                            {ongoingMeetings.map(meeting => (
                                <ListGroup.Item key={meeting.id}>
                                    <h4>{meeting.title}</h4>
                                    <p>{meeting.description}</p>
                                    <p>Scheduled by: {meeting.scheduled_by.username}</p>
                                    <p>Time: {formatDateTime(meeting.scheduled_at)}</p>
                                    {user.profile.is_team_leader && (
                                        <Button variant="danger" onClick={() => handleCancel(meeting.id)} className="me-2">Cancel</Button>
                                    )}
                                    <Button onClick={() => handleAttend(meeting.meeting_link, meeting.id, meeting.scheduled_at)}>Join Meeting</Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>

            <Card className="mb-4 p-3" style={{ backgroundColor: '#fbe9e7' }}>
                <h3
                    className="text-danger"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowCompleted(!showCompleted)}
                >
                    Completed Meetings
                </h3>
                <Collapse in={showCompleted}>
                    <div>
                        <ListGroup>
                            {completedMeetings.map(meeting => (
                                <ListGroup.Item key={meeting.id}>
                                    <h4>{meeting.title}</h4>
                                    <p>{meeting.description}</p>
                                    <p>Scheduled by: {meeting.scheduled_by.username}</p>
                                    <p>Time: {formatDateTime(meeting.scheduled_at)}</p>
                                    {user.profile.is_team_leader && (
                                        <Button variant="danger" onClick={() => handleCancel(meeting.id)} className="me-2">Cancel</Button>
                                    )}
                                    <Button disabled>The meeting has ended</Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                </Collapse>
            </Card>
        </Container>
    );
};

export default Meetings;
