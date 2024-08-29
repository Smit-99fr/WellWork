import React, { Fragment } from 'react'
import Form from './Form'
import Leads from './Leads'
import { useSelector } from 'react-redux';
import { NavLink, Navigate } from 'react-router-dom';


function Dashboard() {
  return (
    <Fragment>

      {/* <Form />
      <Leads /> */}
      <h1>you are logged in</h1>

    </Fragment>
  )
}

export default Dashboard