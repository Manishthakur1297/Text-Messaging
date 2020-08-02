import React, { Component } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import Login from "./components/auth/login";
import Signup from "./components/auth/signup";
import "./style.css";
import User from "./components/users/users";
import Dashboard from "./components/dashboard/dashboard.js";

import Channel from "./components/channel/channel";

import Metrics from "./components/metrics/Metrics";

import { axiosInstance } from "./components/service/axiosApi";

import { Nav, Navbar } from "react-bootstrap";

import PrivateRoute from "./components/route/PrivateRoute";

import PublicRoute from "./components/route/PublicRoute";

class Routes extends Component {
  state = {
    elem: localStorage.getItem("token"),
    user: localStorage.getItem("user"),
  };

  handleLogout = (event) => {
    try {
      localStorage.removeItem("token");
      axiosInstance.defaults.headers["x-auth-token"] = null;
      localStorage.removeItem("user");
      localStorage.removeItem("id");
      window.location.href = "/";
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <div>
        {!this.state.elem ? (
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">Text Messaging</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse className="justify-content-end">
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/signup">Signup</Nav.Link>
            </Navbar.Collapse>
          </Navbar>
        ) : (
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">Text Messaging</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link href="/dashboard">Dashboard</Nav.Link>
              <Nav.Link href="/metrics">Metrics</Nav.Link>
              <Nav.Link href="/create">Create</Nav.Link>
              <Nav.Link href="/users">Users</Nav.Link>
              {/* <Nav.Link href="/users">Profile</Nav.Link> */}
            </Nav>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                Signed in as: <b>{this.state.user}</b>
              </Navbar.Text>
              <Nav.Link onClick={this.handleLogout}>Logout</Nav.Link>
            </Navbar.Collapse>
          </Navbar>
        )}
        <main>
          <BrowserRouter>
            <Switch>
              {/* <Route exact path={"/login/"} render={() => <Login handler = {this.handler} />}/> */}
              <PublicRoute
                restricted={true}
                exact
                path={"/login/"}
                component={Login}
              />
              <PublicRoute
                restricted={true}
                exact
                path={"/signup/"}
                component={Signup}
              />
              <PrivateRoute exact path={"/dashboard/"} component={Dashboard} />
              <PrivateRoute exact path={"/users/"} component={User} />
              <PrivateRoute exact path={"/metrics/"} component={Metrics} />
              <PrivateRoute exact path={"/create/"} component={Channel} />
              <PublicRoute restricted={true} path={"/"} component={Login} />
            </Switch>
          </BrowserRouter>
        </main>
      </div>
    );
  }
}

export default Routes;
