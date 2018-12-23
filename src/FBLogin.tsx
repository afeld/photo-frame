import React, { Component } from "react";
import { SCOPES } from "./Perms";
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
        <ol>
          <li>
            Get Aidan to add you to Testers list (not publicly available yet)
          </li>
          <li>
            <a href="https://developers.facebook.com/requests">
              Accept the App request
            </a>
          </li>
          <li>
            <div
              className="fb-login-button"
              data-auto-logout-link="false"
              data-button-type="login_with"
              data-max-rows="1"
              data-onlogin="checkLoginStatus();"
              data-scope={Array.from(SCOPES).join(",")}
              data-show-faces="false"
              data-size="large"
              data-use-continue-as="false"
            />
          </li>
        </ol>
      </div>
    );
  }
}
