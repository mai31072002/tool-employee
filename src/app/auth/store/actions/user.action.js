import history from "@history";
import _ from "lodash";
import jwtService from "app/service/jwt";

export const SET_USER_DATA = "[USER] SET DATA";
export const REMOVE_USER_DATA = "[USER] REMOVE DATA";
export const USER_LOGGED_OUT = "[USER] LOGGED OUT";

/**
 * Set User Data
 */
export function setUserData(user) {
  return (dispatch) => {
    dispatch({
      type: SET_USER_DATA,
      payload: {
        data: user.data,
        role: [user.role],
      },
    });
  };
}

/**
 * Update User Settings
 */
export function updateUserSettings(settings) {
  return (dispatch, getState) => {
    const oldUser = getState().auth.user;
    const user = _.merge({}, oldUser, { data: { settings } });

    updateUserData(user, dispatch);

    return dispatch(setUserData(user));
  };
}

/**
 * Update User Shortcuts
 */
export function updateUserShortcuts(shortcuts) {
  return (dispatch, getState) => {
    const { user } = getState().auth;
    const newUser = {
      ...user,
      data: {
        ...user.data,
        shortcuts,
      },
    };

    updateUserData(newUser, dispatch);

    return dispatch(setUserData(newUser));
  };
}

/**
 * Remove User Data
 */
export function removeUserData() {
  return {
    type: REMOVE_USER_DATA,
  };
}

/**
 * Logout
 */
export function logoutUser() {
  return (dispatch, getState) => {
    const { user } = getState().auth;

    if (!user.role || user.role.length === 0) {
      // is guest
      return null;
    }

    history.push({
      pathname: "/",
    });

    jwtService.logout();

    return dispatch({
      type: USER_LOGGED_OUT,
    });
  };
}

/**
 * Update User Data
 */
// eslint-disable-next-line no-unused-vars
function updateUserData(user, dispatch) {
  if (!user.role || user.role.length === 0) {
    return;
  }

  jwtService
    .updateUserData(user)
    .then(() => {})
    .catch(() => {});
}
