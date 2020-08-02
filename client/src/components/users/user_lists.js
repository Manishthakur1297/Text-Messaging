import React, { Component } from "react";
import { axiosInstance } from "../service/axiosApi";

var FontAwesome = require("react-fontawesome");

class UserList extends Component {
  state = {};

  userClicked = (user) => (evt) => {
    this.props.userClicked(user);
  };

  render() {
    return (
      <div>
        <h2>Users List</h2>
        {this.props.users.map((user) => {
          return (
            <div key={user._id} className="user-item">
              ID : {user._id}
              <br />
              Username : {user.username}
              <br />
              Email : {user.email}
              <br />
              Region : {user.region}
              <br />
            </div>
          );
        })}
      </div>
    );
  }
}

export default UserList;
