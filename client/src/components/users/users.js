import React, { Component } from "react";
//import { withCookies } from 'react-cookie';
import { axiosInstance } from "../service/axiosApi";

import UserList from "./user_lists";

import CustomModal from "./modal";

class User extends Component {
  state = {
    users: [],
    selectedUser: null,
    show: false,
  };

  componentDidMount() {
    this.getUsers();
  }

  getUsers = () => {
    try {
      axiosInstance.get("/users/").then((res) => {
        // console.log(res.data);
        let data = [].concat(res.data);
        this.setState({ users: data });
      });
      // .catch((error) => console.log(error));
    } catch (error) {
      throw error;
    }
  };

  userClicked = (user) => {
    // console.log(user);
    this.setState({ selecteduser: user });
    this.setState({ show: true });
  };

  hide = () => {
    this.setState({ show: false });
    this.getUsers();
  };

  render() {
    return (
      <div>
        {this.state.show ? (
          <CustomModal
            user={this.state.selecteduser}
            show={this.state.show}
            hide={this.hide}
          />
        ) : null}

        <div>
          <UserList
            users={this.state.users}
            getUsers={this.getUsers}
            userClicked={this.userClicked}
          />
        </div>
      </div>
    );
  }
}

export default User;
