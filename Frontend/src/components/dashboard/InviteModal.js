import React, { Component } from "react";

import { Col, Button, Modal } from "react-bootstrap";

import Form from "react-bootstrap/Form";

import { axiosInstance } from "../service/axiosApi";

class InviteModal extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      users: [],
      formData: {}, // Contains form data
      errors: {}, // Contains field errors
      members: [],
    };
  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers = () => {
    try {
      axiosInstance
        .get("/users/")
        .then((res) => {
          console.log(res.data);
          let data = [].concat(res.data);
          this.setState({ users: data });
        })
        .catch((error) => console.log(error));
    } catch (error) {
      throw error;
    }
  };

  handleUserInvite = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    let { members } = this.state;

    const currentId = members.indexOf(value);

    let newMembers = [...members];

    if (value.length === 0) {
      alert("Selected User can't be empty!!!");
    } else {
      if (currentId === -1) {
        newMembers.push(value);
      }
      this.setState({
        members: newMembers,
      });
    }
  };

  removeUser = (user) => (e) => {
    let { members } = this.state;

    const currentId = members.indexOf(user);

    let newMembers = [...members];

    if (currentId !== -1) {
      newMembers.splice(currentId, 1);
    }
    this.setState({
      members: newMembers,
    });
  };

  hide = () => {
    this.props.hide();
  };

  inviteUsers = async (event) => {
    event.preventDefault();
    try {
      console.log(this.state);
      console.log("props : ", this.props);
      const res = await axiosInstance.put(
        `/channels/${this.props.channel.channelId}/invite`,
        {
          members: [].concat(this.state.members),
        }
      );
      console.log(res);
      this.props.hide();
      //window.location.href = '/'
      //return res;
    } catch (error) {
      alert("Error : Please enter valid details");
      throw error;
    }
  };

  render() {
    console.log(this.state.members);
    return (
      <div>
        <Modal show={this.props.show} onHide={this.hide} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Invite Users</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="Login">
              <Form>
                {this.state.members &&
                  this.state.members.length > 0 &&
                  this.state.members.map((m, i) => (
                    <label
                      key={i}
                      className="badge-pill badge-info"
                      onClick={this.removeUser(m)}
                    >
                      {m} <span className="brand-delete-span">X</span>{" "}
                    </label>
                  ))}
                <Form.Group as={Col} controlId="formGridRegion">
                  <Form.Label>Members</Form.Label>
                  <Form.Control
                    as="select"
                    name="region"
                    placeholder="Invite Users"
                    onChange={this.handleUserInvite}
                  >
                    <option></option>
                    {this.state.users.map((user, idx) => {
                      return (
                        <option key={idx} value={user._id}>
                          {user.username}
                        </option>
                      );
                    })}
                  </Form.Control>
                </Form.Group>
              </Form>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.hide}>
              Close
            </Button>
            <Button variant="primary" onClick={this.inviteUsers}>
              Invite
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default InviteModal;
