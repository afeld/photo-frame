import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

it("renders without crashing", () => {
  const FB = {
    api: jest.fn(),
    AppEvents: { logPageView: jest.fn() },
    Canvas: {},
    Event: {},
    getAuthResponse: jest.fn(),
    getLoginStatus: jest.fn(),
    init: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    ui: jest.fn(),
    XFBML: {}
  };
  const div = document.createElement("div");

  ReactDOM.render(<App FB={FB} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
