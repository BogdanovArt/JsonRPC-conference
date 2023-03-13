import React, { useState } from "react";
import { useSelector } from "react-redux";
import { StylesProvider } from "@material-ui/styles";

import Layout from "./components/layout/Default";
import { ContentPage } from "./components/pages/ContentPage";

import { getColorTheme } from "store/core/getters";

import "assets/scss/main.scss";

function App() {
  const theme = useSelector(getColorTheme);

  return (
    <StylesProvider injectFirst>
      <div
        id="App"
        data-theme={theme}
        className={["app", `theme--${theme}`].join(" ")}
      >
        <Layout main={<ContentPage />} />

        <div id="portal"></div>
      </div>
    </StylesProvider>
  );
}

export default App;
