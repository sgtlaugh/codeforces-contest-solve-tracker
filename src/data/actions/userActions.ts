import {
  getUserInfoURL,
  getUserSubmissionsURL,
  stringToArray,
} from "../../util/bashforces";
import { AppDispatch } from "../store";
import { load, createDispatch } from "./fetchActions";
import {
  ADD_USER,
  CLEAR_USERS,
  ERROR_FETCHING_USER,
  LOADING_USERS,
  ERROR_FETCHING_USER_SUBMISSIONS,
  FETCH_USER_SUBMISSIONS,
  LOADING_USER_SUBMISSIONS,
  CLEAR_USERS_SUBMISSIONS,
} from "./types";

export const clearUsers = (dispatch) =>
  new Promise<void>((resolve, reject) => {
    dispatch({
      type: CLEAR_USERS,
    });
    resolve();
  });

export const fetchUsers = (dispatch, handle: string) => {
  dispatch(load(LOADING_USERS));

  clearUsers(dispatch).then(() => {
    let handleArray: string[] = stringToArray(handle, ",");
    for (let handle of handleArray) {
      if(handle.length === 0) continue;
      dispatch({ type: ADD_USER, payload: { handle } });
    }
  });
};

export const clearUsersSubmissions = (dispatch) => {
  dispatch({
    type: CLEAR_USERS_SUBMISSIONS,
  });
};

export const fetchUserSubmissions = (
  dispatch: AppDispatch,
  handles: string[],
  limit ?: number
) => {
  let currentId = Date.now();
  if (handles.length === 0) clearUsersSubmissions(dispatch);

  for (let handle of handles) {
    dispatch(load(LOADING_USER_SUBMISSIONS));
    fetch(getUserSubmissionsURL(handle,limit))
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status !== "OK")
            return dispatch(
              createDispatch(
                ERROR_FETCHING_USER_SUBMISSIONS,
                "Failed To fetch Submissions for User with handle " + handle
              )
            );
          return dispatch({
            type: FETCH_USER_SUBMISSIONS,
            payload: { result: result.result, id: currentId },
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          return dispatch(
            createDispatch(
              ERROR_FETCHING_USER_SUBMISSIONS,
              "Failed To fetch Submissions for User" + handle
            )
          );
        }
      )
      .catch((e) => {
        // console.log(e);
        return dispatch(
          createDispatch(
            ERROR_FETCHING_USER_SUBMISSIONS,
            "Failed To fetch Submissions for User" + handle
          )
        );
      });
  }
};