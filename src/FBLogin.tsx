import React, { Component } from "react";
import "./FBLogin.css";

interface CheckLoginStatusCB {
  (response: fb.StatusResponse): void;
}

interface Props {
  checkLoginStatus: CheckLoginStatusCB;
}

declare global {
  interface Window {
    checkLoginStatus: CheckLoginStatusCB;
  }
}

export default class FBLogin extends Component<Props> {
  componentDidMount() {
    window.checkLoginStatus = this.props.checkLoginStatus;
  }

  componentWillUnmount() {
    delete window.checkLoginStatus;
  }

  render() {
    return (
      <div className="fb-login-wrapper">
        <div
          className="fb-login-button"
          data-auto-logout-link="false"
          data-button-type="login_with"
          data-max-rows="1"
          data-onlogin="checkLoginStatus();"
          data-scope="user_friends,user_photos"
          data-show-faces="false"
          data-size="large"
          data-use-continue-as="false"
        />
      </div>
    );
  }
}
