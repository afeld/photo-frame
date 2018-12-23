import React, { Component } from "react";
import Carousel from "./Carousel";
import FBLogin, { SCOPES } from "./FBLogin";
import "./App.css";

const RELOAD_AFTER = 24 * 60 * 60 * 1000; // ms

interface Props {
  FB: fb.FacebookStatic;
}

class App extends Component<Props> {
  state = { loggedIn: false };

  componentDidMount() {
    this.props.FB.init({
      appId: "301045530751709",
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

  arePermissionsGranted(perms: any) {
    // convert to a Set
    const grantedScopes = new Set();
    perms.data.forEach((perm: any) => {
      if (perm.status === "granted") {
        grantedScopes.add(perm.permission);
      }
    });

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Implementing_basic_set_operations
    for (const scope of SCOPES) {
      if (!grantedScopes.has(scope)) {
        // missing scope
        console.error(`Missing ${scope} scope.`);
        return false;
      }
    }

    // has all scopes
    return true;
  }

  confirmPermissions(cb: (hasPermissions: boolean) => void) {
    this.props.FB.api("me/permissions", (perms: any) => {
      cb(this.arePermissionsGranted(perms));
    });
  }

  onLogin = (response: fb.StatusResponse) => {
    response.authResponse.grantedScopes;
    if (response.status === "connected") {
      this.confirmPermissions(hasPermissions => {
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
