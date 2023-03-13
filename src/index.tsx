import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import { store } from "./store";
import * as serviceWorker from "./serviceWorker";

import "./index.css";

const pkg = require("../package.json");
console.log("current version: ", pkg?.version);

// initDB(DBConfig);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

if ((module as any).hot) {
  (module as any).hot.accept();
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
