import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { addLead } from '../../actions/leads';
import { Provider as AlertProvider, positions, withAlert } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

//Alert options
const alertOptions = {
  timeout: 3000,
  position: positions.TOP_CENTER
}

export class Form extends Component {
  state = {
    name: '',
    email: '',
    message: ''
  };

  static propTypes = {
    addLead: PropTypes.func.isRequired
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();
    const { name, email, message } = this.state;
    const lead = { name, email, message };
    this.props.addLead(lead)
    if (name.length === 0) {
      this.props.alert.error('Name is required')
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length === 0) {
      this.props.alert.error('Email is required')
    } else if (!emailRegex.test(email)) {
      this.props.alert.error('Email is invalid')
    }
    this.props.alert.success('Lead Added')
    this.setState({
      name: '',
      email: '',
      message: ''
    });
  }

  render() {

    const { name, email, message } = this.state;

    return (
      <div className="card card-body mt-4 mb-4">
        <h2>Add Lead</h2>
        <AlertProvider template={AlertTemplate} {...alertOptions}>

          <form onSubmit={this.onSubmit}>
            <div className="form-group mb-3">
              <label>Name</label>
              <input
                className="form-control"
                type="text"
                name="name"
                onChange={this.onChange}
                value={name}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Email</label>
              <input
                className="form-control"
                type="email"
                name="email"
                onChange={this.onChange}
                value={email}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Message</label>
              <textarea
                className="form-control"
                name="message"
                onChange={this.onChange}
                value={message}
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary">
                Add Lead
              </button>
            </div>
          </form>
        </AlertProvider>

      </div>
    );
  }
}

export default withAlert()(connect(null, { addLead })(Form));