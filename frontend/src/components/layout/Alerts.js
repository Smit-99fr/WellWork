import React, { useEffect } from 'react';
import { useAlert } from 'react-alert';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const Alerts = () => {
    const alert = useAlert();
    const error = useSelector((state) => state.errors);
    const message = useSelector((state) => state.messages);

    useEffect(() => {
        if (error) {
            if (error.msg.name) alert.error(`Name: ${error.msg.name.join()}`);
            if (error.msg.email) alert.error(`Email: ${error.msg.email.join()}`);
            if (error.msg.message) alert.error(`Message: ${error.msg.message.join()}`);
            if (error.msg.non_field_errors) alert.error(error.msg.non_field_errors.join());
            if (error.msg.username) alert.error(error.msg.username.join());
        }

        if (message) {
            if (message.deleteLead) alert.success(message.deleteLead);
            if (message.addLead) alert.success(message.addLead);
            if (message.passNotMatch) alert.error(message.passNotMatch);
        }
    }, [error, message, alert]);

    return null;
};

// Alerts.propTypes = {
//     error: PropTypes.object.isRequired,
//     message: PropTypes.object.isRequired,
// };

export default Alerts;
