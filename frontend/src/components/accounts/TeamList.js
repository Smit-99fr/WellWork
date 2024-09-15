// TeamList.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchTeams,
    addTeamMember,
    removeTeamMember,
    changeTeamLeader,
    createTeam,
    deleteTeam,
} from '../../actions/team';
import { Button, Card, Form, InputGroup, ListGroup, Container, Row, Col } from 'react-bootstrap';

const TeamList = () => {
    const dispatch = useDispatch();
    const teams = useSelector((state) => state.teamReducer.teams);
    const user = useSelector((state) => state.auth.user);

    const [showCreateTeam, setShowCreateTeam] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const [newMemberId, setNewMemberId] = useState(''); // State to manage new member ID input

    useEffect(() => {
        dispatch(fetchTeams());
    }, [dispatch]);




    const handleAddMember = (teamId) => {
        if (newMemberId.trim()) {
            dispatch(addTeamMember(teamId, newMemberId));
            setNewMemberId(''); // Clear the input after adding
        } else {
            alert('Please enter a valid username.');
        }
    };

    const handleRemoveMember = (teamId, userId) => {
        dispatch(removeTeamMember(teamId, userId));
    };

    const handleChangeLeader = (teamId, newLeaderId) => {
        dispatch(changeTeamLeader(teamId, newLeaderId));
    };

    const handleCreateTeam = () => {
        setShowCreateTeam(true);
    };

    const handleTeamDeletion = (teamId) => {
        dispatch(deleteTeam(teamId));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createTeam(formData));
        setShowCreateTeam(false); // Hide form after creation
    };

    const isUserWithoutTeam = !user?.profile?.team;

    // Filter teams to display only if the user is a member
    const userTeams = teams.filter((team) =>
        team.members.some((member) => member.id === user?.id)
    );

    return (
        <Container>
            <h1 className="my-4 text-center">Teams</h1>

            {/* Show Create Team button for users without a team */}
            {isUserWithoutTeam && !showCreateTeam && (
                <Button className="mb-3" onClick={handleCreateTeam} variant="primary">
                    Create Team
                </Button>
            )}

            {/* Display the form for creating a new team */}
            {showCreateTeam && (
                <Card className="mb-4">
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Team Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter Team Name"
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Team Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter Team Description"
                                    rows={3}
                                />
                            </Form.Group>
                            <Button type="submit" variant="success" className="me-2">
                                Create Team
                            </Button>
                            <Button variant="secondary" onClick={() => setShowCreateTeam(false)}>
                                Cancel
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            )}

            <Row>
                {userTeams.map((team) => (
                    <Col key={team.id} xs={12} md={6} lg={4} className="mb-4">
                        <Card>
                            <Card.Header className="bg-primary text-white">{team.name}</Card.Header>
                            <Card.Body>
                                <Card.Title>Members</Card.Title>
                                <ListGroup variant="flush">
                                    {team.members.map((member) => (
                                        <ListGroup.Item key={member.id} className="d-flex justify-content-between align-items-center">
                                            {member.username} {member.profile.is_team_leader ? '(Leader)' : ''}
                                            {user.profile.is_team_leader ? <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() => handleRemoveMember(team.id, member.id)}
                                            >
                                                Remove
                                            </Button> : ''}

                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                                {user.profile.is_team_leader ? <InputGroup className="mt-3">
                                    <Form.Control
                                        type="text"
                                        value={newMemberId}
                                        onChange={(e) => setNewMemberId(e.target.value)}
                                        placeholder="Enter Username to add"
                                    />
                                    <Button onClick={() => handleAddMember(team.id)} variant="outline-primary">
                                        Add Member
                                    </Button>
                                </InputGroup> : ''}

                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-between">
                                {user.profile.is_team_leader ?
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => handleTeamDeletion(team.id)}
                                    >
                                        Delete Team
                                    </Button> : <i>only Team leader could add and remove team members</i>}
                            </Card.Footer>

                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default TeamList;
