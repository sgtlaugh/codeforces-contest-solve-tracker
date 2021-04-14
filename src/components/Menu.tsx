import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  AppBar,
  Button,
  GridList,
  GridListTile,
  Link,
  ListItem,
  Toolbar,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import App from "../App";
import {
  fetchContestList,
  fetchProblemList,
  fetchSharedProblemList,
} from "../data/actions/fetchActions";
import { AppReducerType } from "../data/actions/types";
import { fetchUserSubmissions, fetchUsers } from "../data/actions/userActions";
import { RootState, RootStateType } from "../data/store";
import RefreshIcon from "@material-ui/icons/Refresh";
import { PROBLEMS, CONTESTS } from "../util/constants";

const Menu = (): JSX.Element => {
  const dispatch = useDispatch();

  const [handle, setHandle] = useState("");
  const state: RootStateType = useSelector((state) => state);

  useEffect(() => {
    if (state.appState.loaded == false) {
      // sync();
      dispatch({ type: AppReducerType.APP_LOADED, message: "Loaded" });
    }
  }, []);

  useEffect(() => {
    if (state.appState.loaded == false) {
      sync();
      dispatch({ type: AppReducerType.APP_LOADED, message: "Loaded" });
    } else {
      fetchUserSubmissions(dispatch, state.userList.handles);
    }
  }, [state.userList]);

  const sync = () => {
    fetchProblemList(dispatch);
    fetchUserSubmissions(dispatch, state.userList.handles);
    fetchContestList(dispatch);
    fetchSharedProblemList(dispatch);
  };

  const submitUser = () => {
    // Notification.info({
    //   title: "User submitted!",
    //   duration: 200,
    //   description: "hh",
    // });
    fetchUsers(dispatch, handle);
  };

  return (
    <AppBar position="static" color="default">
      {/* <nav className="navbar navbar-expand-lg navbar-light bg-light p-2"> */}
      <Toolbar>
        <ListItem component={RouterLink} to="/" color="primary">
          BashForces
        </ListItem>

        {/* <ul className="navbar-nav ml-auto mt-2 mt-lg-0"> */}
        <Button color="primary" onClick={() => sync()}>
          <RefreshIcon />
        </Button>
        <ListItem button component={RouterLink} to={PROBLEMS}>
          Problem List
        </ListItem>
        <ListItem button component={RouterLink} to={CONTESTS}>
          Contest
        </ListItem>
        {/* </ul> */}
        <form
          className="form-inline d-flex my-2 my-lg-0"
          onSubmit={(e) => {
            e.preventDefault();
            submitUser();
          }}>
          <input
            name="handle"
            className="form-control mr-sm-2"
            type="search"
            placeholder="Handle"
            aria-label="Search"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
          />
        </form>
      </Toolbar>
    </AppBar>
  );
};

export default Menu;
