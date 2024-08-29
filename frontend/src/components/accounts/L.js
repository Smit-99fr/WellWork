import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button } from 'react-bootstrap';
import { NavLink, Navigate } from 'react-router-dom';
import './login.css';
import logo from '../../../static/logo.svg'
import { login } from '../../actions/auth';


const Login = () => {

  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => (state.auth.isAuthenticated));

  const [state, setState] = useState({
    username: "",
    password: ""
  });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(state.username, state.password)); // Dispatch the login action
  };

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const { username, password } = state;

  // Redirect if authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <React.Fragment>
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless text-center">
            <Card.Body>
              <div className="mb-4">
                <i className="feather icon-unlock auth-icon" />
              </div>
              <h3 className="mb-4">Login</h3>
              <form onSubmit={onSubmit}>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    placeholder="Username"
                    onChange={onChange}
                    value={username}
                  />
                </div>
                <div className="input-group mb-4">
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Password"
                    onChange={onChange}
                    value={password}
                  />
                </div>
                <p className="mb-2 text-muted">
                  Forgot password?{' '}
                  <NavLink to="#" className="f-w-400">
                    Reset
                  </NavLink>
                </p>
                <button className="btn btn-light border w-100 my-2">
                  <img
                    src={logo}
                    alt="Google logo"
                    style={{ width: '20px', marginRight: '10px' }}
                  />
                  Log in with Google
                </button>

                <button className="btn btn-primary mt-3" type='submit'>Login</button>
                <p className="mb-0 text-muted">
                  Don’t have an account?{' '}
                  <NavLink to="/register" className="f-w-400">
                    Register
                  </NavLink>
                </p>
              </form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;
