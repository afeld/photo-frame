import React, { Component } from "react";
import Carousel from "./Carousel";
import FBLogin from "./FBLogin";
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

  onLogin = (response: fb.StatusResponse) => {
    if (response.status === "connected") {
      this.setState({ loggedIn: true });
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
