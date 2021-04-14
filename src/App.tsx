import "./App.css";
import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchContestList,
  fetchProblemList,
  fetchSharedProblemList,
} from "./data/actions/fetchActions";

import { fetchUserSubmissions } from "./data/actions/userActions";

import Menu from "./components/Menu";
import ProblemPage from "./components/problem/ProblemPage";
import ContestPage from "./components/contest/ContestPage";
import HomePage from "./components/home/HomePage";
import { PROBLEMS, CONTESTS } from "./util/constants";
import { RootStateType } from "./data/store";
import { createMuiTheme, Grid, Paper, ThemeProvider } from "@material-ui/core";

function App() {
  const dispatch = useDispatch();
  const state: RootStateType = useSelector((state: any) => state);

  const darkTheme = createMuiTheme({
    palette: {
      type: "dark",
      primary: {
        main: "#ad1457",
      },
      secondary: {
        main: "#6a1b9a",
      },
    },
  });

  const lightTheme = createMuiTheme({
    palette: {
      type: "light",
    },
  });

  useEffect(() => {
    document.body.classList.add("bg-dark");
    document.title = "BashForces";
  }, []);

  return (
    <ThemeProvider theme={state.appState.darkMode ? darkTheme : lightTheme}>
      <Paper>
        <Grid
          container
          direction="column"
          justify="space-between"
          alignItems="flex-start"
          xs={12}>
          {/* <div className="App container-fluid bg-dark min-vh-100 d-flex justify-content-between  flex-column"> */}
          <div className="top">
            <div className="menu w-100">
              <Menu />
            </div>

            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path={PROBLEMS} component={ProblemPage} />
              <Route strict path={CONTESTS} component={ContestPage} />
            </Switch>
          </div>
          <footer className="text-light text-center justify-content-center p-3 w-100 align-self-end">
            All rights reserved by @Bashem
          </footer>
          {/* </div> */}
        </Grid>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
