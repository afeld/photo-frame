import React, { Component } from "react";
import "./FBLogin.css";

interface LoggedInCB {
  (response: fb.StatusResponse): void;
}

interface Props {
  FB: fb.FacebookStatic;
  onLoggedIn: LoggedInCB;
}

export default class FBLogin extends Component<Props> {
  onClick = () => {
    this.props.FB.login(this.props.onLoggedIn, { scope: "user_photos" });
  };

  render() {
    return (
      <a className="fb-login" href="#" onClick={this.onClick}>
        Login with Facebook
      </a>
    );
  }
}
