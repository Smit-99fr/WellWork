import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const PrivateRoute = ({ element: Element }) => {
    const auth = useSelector(state => state.auth); // Access the auth state from Redux

    if (auth.isLoading) {
        return <h2>Loading...</h2>;
    }
    console.log('Private route called') //dev testing log
    return auth.isAuthenticated ? <Element /> : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
    element: PropTypes.elementType.isRequired, // Ensure the 'element' prop is a React component
};

export default PrivateRoute;
