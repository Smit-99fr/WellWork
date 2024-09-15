import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";  // Import connect to map state to props
import { Provider } from "react-redux";
import { Provider as AlertProvider, positions } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";  // Import useLocation to check current route

import Header from "./layout/Header";
import Dashboard from "./Leads/Dashboard";
import ProfilePage from "./accounts/profile";
import Tasks from "./Leads/Tasks";
import Meetings from "./Leads/Meetings";
import Login from "./accounts/Login";
import Register from "./accounts/Register";
import TeamList from "./accounts/TeamList";
import PrivateRoute from "./common/PrivateRoute";
import VerticalNav from "./layout/VerticalNav";  // Import the VerticalNav
import { store, persistor } from "../store";
import { loadUser } from "../actions/auth";
import { PersistGate } from 'redux-persist/integration/react';
import Alerts from "./layout/Alerts";

// Alert options
const alertOptions = {
    timeout: 3000,
    position: positions.TOP_CENTER
}

class App extends Component {
    componentDidMount() {
        store.dispatch(loadUser());
    }

    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <AlertProvider template={AlertTemplate} {...alertOptions}>
                        <Router>
                            <>
                                <Header />
                                <Alerts />
                                <div className="app-layout">
                                    <VerticalNav />
                                    <ConditionalContentContainer />
                                </div>
                            </>
                        </Router>
                    </AlertProvider>
                </PersistGate>
            </Provider>
        );
    }
}

// Component to conditionally apply CSS to content-container based on the route
const ConditionalContentContainer = () => {
    const location = useLocation();  // Get current route

    // Check if the current path is /login or /register
    const noLayout = location.pathname === '/login' || location.pathname === '/register';

    return (
        <div className={noLayout ? 'content' : 'content-container'}>
            <Routes>
                <Route path="/" element={<PrivateRoute element={Dashboard} />} />
                <Route path="/tasks" element={<PrivateRoute element={Tasks} />} />
                <Route path="/meetings" element={<PrivateRoute element={Meetings} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile-page" element={<PrivateRoute element={ProfilePage} />} />
                <Route path="/team-page" element={<PrivateRoute element={TeamList} />} />
            </Routes>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('app'));

