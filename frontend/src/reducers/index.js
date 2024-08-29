import { combineReducers } from "redux";
import leads from './leads';
import errors from "./errors";
import auth from './auth';
import messages from "./messages";


export default combineReducers({
    leads,
    errors,
    auth,
    messages,
});