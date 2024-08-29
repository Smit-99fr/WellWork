import React, { useState } from 'react';
import './LoginSignupPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '../../actions/auth';
import { NavLink, Navigate } from 'react-router-dom';

const Login = () => {
    const [isLoginActive, setIsLoginActive] = useState(true);
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => (state.auth.isAuthenticated));
    const [state, setState] = useState({
        username: "",
        password: "",
        email: ""
    });

    const onSubmitLogin = (e) => {
        e.preventDefault();
        dispatch(login(state.username, state.password)); // Dispatch the login action
    };

    const onSubmitRegister = (e) => {
        e.preventDefault();
        const { username, password, email } = state;
        const newUser = {
            username,
            email,
            password
        }
        dispatch(register(newUser));
        console.log('registered')
    };

    const handleSwitcherClick = () => {
        setIsLoginActive(!isLoginActive);
    };

    const onChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const { username, password, email } = state;

    // Redirect if authenticated
    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <div className='cover'>
            <section className="forms-section">
                <h1 className="section-title">{isLoginActive ? "Welcome Back!" : "Create An Account"}</h1>
                <div className="forms">
                    <div className={`form-wrapper ${isLoginActive ? 'is-active' : ''}`}>
                        <button
                            type="button"
                            className="switcher switcher-login"
                            onClick={handleSwitcherClick}
                        >
                            Login
                            <span className="underline"></span>
                        </button>
                        <form className="form form-login" onSubmit={onSubmitLogin}>
                            <fieldset>
                                <legend>Please, enter your email and password for login.</legend>
                                <div className="input-block">
                                    <label htmlFor="login-email">Username</label>
                                    <input
                                        id="login-email" type="text"
                                        name='username'
                                        value={username}
                                        onChange={onChange}
                                        required />
                                </div>
                                <div className="input-block">
                                    <label htmlFor="login-password">Password</label>
                                    <input id="login-password" type="password"
                                        name='password'
                                        value={password}
                                        onChange={onChange}
                                        required />
                                </div>
                            </fieldset>
                            <button type="submit" className="btn-login">Login</button>
                        </form>
                    </div>
                    <div className={`form-wrapper ${!isLoginActive ? 'is-active' : ''}`}>
                        <button
                            type="button"
                            className="switcher switcher-signup"
                            onClick={handleSwitcherClick}
                        >
                            Register
                            <span className="underline"></span>
                        </button>
                        <form className="form form-signup" onSubmit={onSubmitRegister}>
                            <fieldset>
                                <legend>Please, enter your email, password and password confirmation for sign up.</legend>
                                <div className="input-block">
                                    <label htmlFor="signup-username">Username</label>
                                    <input id="signup-username" type="text"
                                        onChange={onChange}
                                        value={username}
                                        name='username'
                                        required />
                                </div>
                                <div className="input-block">
                                    <label htmlFor="signup-email">E-mail</label>
                                    <input id="signup-email" type="email"
                                        onChange={onChange}
                                        value={email}
                                        name='email'
                                        required />
                                </div>
                                <div className="input-block">
                                    <label htmlFor="signup-password">Password</label>
                                    <input id="signup-password" type="password"
                                        onChange={onChange}
                                        value={password}
                                        name='password'
                                        required />
                                </div>
                            </fieldset>
                            <button type="submit" className="btn-signup">Sign Up</button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;
