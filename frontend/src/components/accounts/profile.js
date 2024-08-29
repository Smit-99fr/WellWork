import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { loadUser } from '../../actions/auth';


const ProfilePage = () => {
    const { isAuthenticated, user } = useSelector((state) => (state.auth));
    const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(loadUser());
    // }, []);


    if (!isAuthenticated) {
        <Navigate to={'/'} />
    }

    return (


        <div style={styles.container}>
            <div style={styles.profileCard}>
                <img src={user.profile.image_url} alt="Profile" style={styles.profileImage} />
                <h2 style={styles.name}>{user.username}</h2>
                <p style={styles.email}>email: {user.email}</p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
    },
    profileCard: {
        textAlign: 'center',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        width: '300px',
    },
    profileImage: {
        borderRadius: '50%',
        width: '150px',
        height: '150px',
        objectFit: 'cover',
    },
    name: {
        fontSize: '24px',
        margin: '10px 0',
    },
    email: {
        fontSize: '18px',
        color: '#777',
    },
};

export default ProfilePage;
