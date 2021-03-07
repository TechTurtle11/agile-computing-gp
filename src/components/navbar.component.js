import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

export default class Navbar extends Component {

  render() {
    var username = Cookies.get("username");
    var logged_in = (username !== undefined);

    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">Task Manager</Link>
        <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
          <Link to="/" className="nav-link">Tasks</Link>
          </li>
          <li className="navbar-item">
          <Link to="/create" className="nav-link">Create Task</Link>
          </li>
          <li className="navbar-item">
          <Link to="/about" className="nav-link">About Us</Link>
          </li>
          {
            logged_in
            ? React.Children.toArray([
              <li className="navbar-item">
                <a href="#" className="nav-link" onClick={() => {
                  axios.get('http://localhost:5000/users/get_id_by_username/' + username)
                  .then(response => {
                    if (response.data.length > 0) {
                      var id = response.data;
                      window.location = '/profile/' + id;
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  })
                }}>Profile</a>
              </li>,
              <li className="navbar-item">
                <a href="#" className="nav-link" onClick={() => {
                  Cookies.remove("username");
                  window.location = '/';
                  }}>Log Out</a>
              </li>
            ])
            : React.Children.toArray([
                <li className="navbar-item">
                <Link to="/signup" className="nav-link">Sign Up</Link>
                </li>,
                <li className="navbar-item">
                <Link to="/signin" className="nav-link">Log In</Link>
                </li>
            ])
          }
        </ul>
        </div>
      </nav>
    );
  }
}
