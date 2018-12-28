import React, { Component } from "react";
import Carousel from "./Carousel";
import FBLogin from "./FBLogin";
import confirmPermissions from "./Perms";
import "./App.css";

const RELOAD_AFTER = 24 * 60 * 60 * 1000; // ms
export const FACEBOOK_ID = "301045530751709";

interface Props {
  FB: fb.FacebookStatic;
}

class App extends Component<Props> {
  state = { loggedIn: false };

  componentDidMount() {
    this.props.FB.init({
      appId: FACEBOOK_ID,
      status: true,
      xfbml: true,
      version: "v3.2"
    });

    this.props.FB.AppEvents.logPageView();
    this.checkLoginStatus();

    setTimeout(() => {
      document.location.reload(true);
    }, RELOAD_AFTER);
  }

  checkLoginStatus = () => {
    this.props.FB.getLoginStatus(this.onLogin);
  };

  onLogin = (response: fb.StatusResponse) => {
    response.authResponse.grantedScopes;
    if (response.status === "connected") {
      confirmPermissions(this.props.FB, hasPermissions => {
        this.setState({ loggedIn: hasPermissions });
      });
    }
  };

  render() {
    const main = this.state.loggedIn ? (
      <Carousel FB={this.props.FB} />
    ) : (
      <FBLogin checkLoginStatus={this.checkLoginStatus} />
    );

    return <div className="App">{main}</div>;
  }
}

export default App;
