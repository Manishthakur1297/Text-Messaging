import React, { Component } from "react";
import { Col, Button } from "react-bootstrap";

import Form from "react-bootstrap/Form";

import "../auth/login.sass";
import {
  isEmail,
  isEmpty,
  isLength,
  isContainWhiteSpace,
} from "../shared/validator";
import { axiosInstance } from "../service/axiosApi";

class Channel extends Component {
  constructor(props) {
    super(props);

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
          // console.log(res.data);
          let data = [].concat(res.data);
          this.setState({ users: data });
        })
        .catch((error) => console.log(error));
    } catch (error) {
      throw error;
    }
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    let { formData } = this.state;
    formData[name] = value;

    this.setState({
      formData: formData,
    });
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

  validateRegisterForm = (e) => {
    let errors = {};
    const { formData } = this.state;

    if (isEmpty(formData.name)) {
      errors.name = "Channel Name can't be blank";
    }

    if (isEmpty(formData.tags)) {
      errors.tags = "Tags can't be blank";
    }

    if (isEmpty(errors)) {
      return true;
    } else {
      return errors;
    }
  };

  createChannel = async (e) => {
    e.preventDefault();

    let errors = this.validateRegisterForm();
    if (errors === true) {
      try {
        let tags = this.state.formData.tags
          .split(",")
          .map((s) => s.trim().toUpperCase());
        const res = await axiosInstance.post("/channels/", {
          name: this.state.formData.name,
          description: this.state.formData.description,
          tags: tags,
          members: this.state.members,
        });
        window.location.href = "/";
      } catch (error) {
        throw error;
      }
    } else {
      this.setState({
        errors: errors,
      });
    }
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="Login">
        <Form>
          <Form.Group as={Col} controlId="formGridName">
            <Form.Label>Channel Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              onChange={this.handleInputChange}
              placeholder="Enter Channel Name"
            />
            {errors.name && <Form.Text>{errors.name}</Form.Text>}
          </Form.Group>

          <Form.Group as={Col} controlId="formGridDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              onChange={this.handleInputChange}
              placeholder="Enter Description"
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridTags">
            <Form.Label>Tags</Form.Label>
            <Form.Control
              type="text"
              name="tags"
              onChange={this.handleInputChange}
              placeholder="Enter Tags(Multiple separate by ,)"
            />
            {errors.tags && <Form.Text>{errors.tags}</Form.Text>}
          </Form.Group>

          {this.state.members.length > 0 &&
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

          <Button
            as={Col}
            variant="primary"
            type="submit"
            onClick={this.createChannel}
          >
            Create
          </Button>
        </Form>
      </div>
    );
  }
}

export default Channel;
