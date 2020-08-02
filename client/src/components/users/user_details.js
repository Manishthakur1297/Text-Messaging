import React, { Component } from "react";

class UserDetails extends Component {
  render() {
    return (
      <div>
        <h2>User Details</h2>
        {this.props.user ? (
          <div className="meal-item">
            <p>Name : {this.props.user.username}</p>
            <p>Email : {this.props.user.email}</p>
            <p>Region : {this.props.region}</p>
          </div>
        ) : null}
      </div>
    );
  }
}

export default UserDetails;
