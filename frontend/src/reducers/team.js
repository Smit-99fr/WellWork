// reducers/teamReducer.js
import {
    FETCH_TEAMS,
    CREATE_TEAM_SUCCESS,
    CREATE_TEAM_FAIL,
    ADD_TEAM_MEMBER,
    REMOVE_TEAM_MEMBER_SUCCESS,
    REMOVE_TEAM_MEMBER_FAIL,
    CHANGE_TEAM_LEADER,
    DELETE_TEAM_SUCCESS,
    DELETE_TEAM_FAIL,
} from '../actions/types';

const initialState = {
    teams: [], // Stores all teams
    error: null, // Error state for handling failures
};

export default function teamReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_TEAMS:
            return {
                ...state,
                teams: action.payload,
                loading: false,
            };

        case CREATE_TEAM_SUCCESS:
            return {
                ...state,
                teams: [...state.teams, action.payload], // Add the newly created team to the list
                loading: false,
            };

        case CREATE_TEAM_FAIL:
            return {
                ...state,
                error: 'Failed to create team.',
                loading: false,
            };

        case ADD_TEAM_MEMBER:
            return {
                ...state,
                teams: state.teams.map((team) =>
                    team.id === action.payload.teamId
                        ? {
                            ...team,
                            members: [...team.members, action.payload.member], // Add the new member to the team members list
                        }
                        : team
                ),
            };

        case REMOVE_TEAM_MEMBER_SUCCESS:
            return {
                ...state,
                teams: state.teams.map((team) =>
                    team.id === action.payload.teamId
                        ? {
                            ...team,
                            members: team.members.filter(
                                (member) => member.id !== action.payload.userId // Remove the member from the team
                            ),
                        }
                        : team
                ),
            };

        case REMOVE_TEAM_MEMBER_FAIL:
            return {
                ...state,
                error: 'Failed to remove team member.',
                loading: false,
            };

        case CHANGE_TEAM_LEADER:
            return {
                ...state,
                teams: state.teams.map((team) =>
                    team.id === action.payload.teamId
                        ? {
                            ...team,
                            members: team.members.map((member) =>
                                member.id === action.payload.newLeaderId
                                    ? { ...member, profile: { ...member.profile, is_team_leader: true } }
                                    : { ...member, profile: { ...member.profile, is_team_leader: false } }
                            ),
                        }
                        : team
                ),
            };

        case DELETE_TEAM_SUCCESS:
            return {
                ...state,
                teams: state.teams.filter((team) => team.id !== action.payload), // Remove the team from the list
                loading: false,
            };

        case DELETE_TEAM_FAIL:
            return {
                ...state,
                error: 'Failed to delete team.',
                loading: false,
            };

        default:
            return state;
    }
}
