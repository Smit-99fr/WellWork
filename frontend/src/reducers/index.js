import { combineReducers } from "redux";
import leads from './leads';
import errors from "./errors";
import auth from './auth';
import messages from "./messages";
import teamReducer from "./team";


export default combineReducers({
    errors,
    auth,
    messages,
    teamReducer
});