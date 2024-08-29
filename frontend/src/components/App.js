import React, { Component } from "react";
import ReactDOM from "react-dom";
import Header from "./layout/Header";
import Dashboard from "./Leads/Dashboard";
import ProfilePage from "./accounts/profile";
import Login from "./accounts/Login";
import Register from "./accounts/Register";
import PrivateRoute from "./common/PrivateRoute";
import { Provider } from "react-redux";
import { Provider as AlertProvider, positions } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { loadUser } from "../actions/auth";
import { PersistGate } from 'redux-persist/integration/react';
// Alert options
const alertOptions = {
    timeout: 3000,
    position: positions.TOP_CENTER
}

import { store, persistor } from "../store";
import Alerts from "./layout/Alerts";

class App extends Component {
    componentDidMount() {
        store.dispatch(loadUser())
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
                                <div className='container'>
                                    <Routes>
                                        <Route path="/" element={<PrivateRoute element={Dashboard} />} />
                                        <Route path="/register" element={<Register />} />
                                        <Route path="/login" element={<Login />} />
                                        <Route path="/profile-page" element={<ProfilePage />} />

                                    </Routes>
                                </div>
                            </>
                        </Router>
                    </AlertProvider>
                </PersistGate>
            </Provider>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
