//check API errors during team creation (using postman)

import axios from 'axios';
import {
    FETCH_TEAMS,
    ADD_TEAM_MEMBER,
    REMOVE_TEAM_MEMBER,
    CHANGE_TEAM_LEADER,
    CREATE_TEAM_SUCCESS,
    CREATE_TEAM_FAIL,
    DELETE_TEAM_SUCCESS,
    DELETE_TEAM_FAIL,
    REMOVE_TEAM_MEMBER_SUCCESS,
    REMOVE_TEAM_MEMBER_FAIL,
} from './types';
import { tokenConfig } from './auth';

// Fetch all teams
export const fetchTeams = () => async (dispatch, getState) => {
    try {
        const response = await axios.get('/api/teams/', tokenConfig(getState));
        dispatch({ type: FETCH_TEAMS, payload: response.data });
    } catch (error) {
        console.error('Failed to fetch teams', error.response?.data || error.message);
    }
};

// Create a new team
export const createTeam = (formData) => async (dispatch, getState) => {
    try {
        const res = await axios.post('/api/teams/', formData, tokenConfig(getState));
        dispatch({
            type: CREATE_TEAM_SUCCESS,
            payload: res.data,
        });
    } catch (err) {
        console.error('Error creating team:', err.response?.data || err.message);
        dispatch({
            type: CREATE_TEAM_FAIL,
        });
    }
};

// Add a specified user to the team
export const addTeamMember = (teamId, uname) => async (dispatch, getState) => {
    try {
        const response = await axios.post(
            `/api/teams/${teamId}/add_member/`,
            { username: uname },
            tokenConfig(getState)
        );
        const member = response.data.user;
        dispatch({ type: ADD_TEAM_MEMBER, payload: { teamId, member } });
    } catch (error) {
        console.error('Failed to add team member:', error.response?.data || error.message);
    }
};

// Remove a specified member from the team
export const removeTeamMember = (teamId, userId) => async (dispatch, getState) => {
    try {
        const response = await axios.post(
            `/api/teams/${teamId}/remove_member/`,
            { user_id: userId },
            tokenConfig(getState)
        );
        dispatch({ type: REMOVE_TEAM_MEMBER_SUCCESS, payload: { teamId, userId } });
    } catch (error) {
        console.error('Failed to remove team member:', error.response?.data || error.message);
        dispatch({ type: REMOVE_TEAM_MEMBER_FAIL });
    }
};

// Change the team leader
export const changeTeamLeader = (teamId, newLeaderId) => async (dispatch, getState) => {
    try {
        const response = await axios.post(
            `/api/teams/${teamId}/change_leader/`,
            { new_leader_id: newLeaderId },
            tokenConfig(getState)
        );
        dispatch({ type: CHANGE_TEAM_LEADER, payload: { teamId, newLeaderId } });
    } catch (error) {
        console.error('Failed to change team leader', error.response?.data || error.message);
    }
};

// Delete a team by ID
export const deleteTeam = (teamId) => async (dispatch, getState) => {
    try {
        await axios.delete(`/api/teams/${teamId}/`, tokenConfig(getState));
        dispatch({ type: DELETE_TEAM_SUCCESS, payload: teamId });
    } catch (error) {
        console.error('Failed to delete team:', error.response?.data || error.message);
        dispatch({ type: DELETE_TEAM_FAIL });
    }
};
