import React, { Component } from "react";
import {
  Row,
  FormGroup,
  FormControl,
  FormLabel,
  Button,
  FormText,
} from "react-bootstrap";
import "./login.sass";
import { isEmpty, isLength, isContainWhiteSpace } from "../shared/validator";
import { axiosInstance } from "../service/axiosApi";
//import { Redirect } from 'react-router-dom'

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {}, // Contains login form data
      errors: {}, // Contains login field errors
      // formSubmitted: false, // Indicates submit status of login form
      loading: false, // Indicates in progress state of login form
    };
  }

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

  validateLoginForm = (e) => {
    let errors = {};
    const { formData } = this.state;

    if (isEmpty(formData.username)) {
      errors.username = "Username can't be blank";
    }

    if (isEmpty(formData.password)) {
      errors.password = "Password can't be blank";
    } else if (isContainWhiteSpace(formData.password)) {
      errors.password = "Password should not contain white spaces";
    } else if (!isLength(formData.password, { gte: 1, lte: 16, trim: true })) {
      errors.password = "Password's length must between 6 to 16";
    }

    if (isEmpty(errors)) {
      return true;
    } else {
      return errors;
    }
  };

  login = async (e) => {
    e.preventDefault();

    let errors = this.validateLoginForm();

    if (errors === true) {
      try {
        const res = await axiosInstance.post("/login/", {
          username: this.state.formData.username,
          password: this.state.formData.password,
          // data:this.state.formData
        });
        // console.log(res);
        //console.log(res.data.access, res.data.refresh)
        axiosInstance.defaults.headers["x-auth-token"] = res.data.token;
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("id", res.data.id);
        localStorage.setItem("user", this.state.formData.username);
        window.location.href = "/dashboard";
      } catch (error) {
        throw error;
      }
    } else {
      this.setState({
        errors: errors,
        // formSubmitted: true
      });
    }
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="Login">
        <Row>
          <form onSubmit={this.login}>
            <FormGroup>
              <FormLabel>Username</FormLabel>
              <FormControl
                type="text"
                name="username"
                placeholder="Enter your username"
                onChange={this.handleInputChange}
              />
              {errors.username && <FormText>{errors.username}</FormText>}
            </FormGroup>
            <FormGroup>
              <FormLabel>Password</FormLabel>
              <FormControl
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={this.handleInputChange}
              />
              {errors.password && <FormText>{errors.password}</FormText>}
            </FormGroup>
            <Button type="submit">Sign In</Button>
          </form>
        </Row>
      </div>
    );
  }
}

export default Login;
