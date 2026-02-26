import jwtService from "app/service/jwt";
import * as UserActions from "./user.action";
import axios from "axios";
// import axios from "axios";
export const AUTH_ERROR = "AUTH_ERROR";
export const AUTH_SUCCESSS = "AUTH_SUCCESSS";
export const AUTH_LOADING = "AUTH_LOADING";
export const AUTH_FETCH = "AUTH_FETCH";
export const AUTH_RESET = "AUTH_RESET";
export const FORGOT_PASS = "FORGOT_PASS";
export const FORGOT_PASS_ERROR = "FORGOT_PASS_ERROR";

export const register =
  ({ email, password }) =>
  (dispatch) => {
    dispatch({ type: AUTH_LOADING });

    jwtService
      .register(email, password)
      .then(() => dispatch({ type: AUTH_SUCCESSS }))
      .catch((error) => {
        dispatch({
          type: AUTH_ERROR,
          payload: error,
        });
        window.alert(error); // Hiện popup lỗi
      });
  };

export const submitLogin = (param) => (dispatch) => {
  dispatch({ type: AUTH_LOADING });
  return jwtService
    .signInWithUsernameAndPassword(param)
    .then((user) => {
      dispatch(UserActions.setUserData(user));
      dispatch({ type: AUTH_SUCCESSS });
      dispatch({
        type: AUTH_FETCH,
        payload: user.data,
      });
      return user;
    })
    .catch((error) => {
      dispatch({
        type: AUTH_ERROR,
        payload: error,
      });

      throw error;
    });
};

export const logout = () => (dispatch) => {
  dispatch({
    type: AUTH_RESET,
  });
  return jwtService.logout();
};

export const fetchUserDetail = () => async (dispatch) => {
    let token = localStorage.getItem("jwt_access_token");

    if (!token) {
        return;
    }

    const fetchData = async (token) => {
        try {
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            const userDetail = await jwtService.getUserDetail();
            dispatch(UserActions.setUserDetail(userDetail));
        } catch (error) {
            if (error.response && error.response.status === 401) {
                try {
                    const newToken = await jwtService.signInWithToken();
                    if (newToken) {
                        localStorage.setItem("jwt_access_token", newToken);
                        axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
                        const userDetail = await jwtService.getUserDetail();
                        dispatch(UserActions.setUserDetail(userDetail));
                    } else {
                        throw new Error("Không thể làm mới token");
                    }
                } catch (refreshError) {
                    dispatch(UserActions.setUserDetail(null)); 
                }
            } else {
                console.error("❌ Lỗi khi lấy thông tin user:", error);
            }
        }
    };

    await fetchData(token);
};

export const fetchEmployeeDetail = (id) => async (dispatch) => {
    let token = localStorage.getItem("jwt_access_token");

    if (!token) {
        return;
    }

    const fetchData = async (token) => {
        try {
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            const employeeDetail = await axios.get(`/employee/${id}`);
            
            dispatch(UserActions.setEmployeeDetail(employeeDetail));
        } catch (error) {
            if (error.response && error.response.status === 401) {
                try {
                    const newToken = await jwtService.signInWithToken();
                    if (newToken) {
                        localStorage.setItem("jwt_access_token", newToken);
                        axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
                        const employeeDetail = await axios.get(`/employee/${id}`);
                        
                        dispatch(UserActions.setEmployeeDetail(employeeDetail));
                    } else {
                        throw new Error("Không thể làm mới token");
                    }
                } catch (refreshError) {
                    dispatch(UserActions.setEmployeeDetail(null)); 
                }
            } else {
                console.error("❌ Lỗi khi lấy thông tin user:", error);
            }
        }
    };

    await fetchData(token);
};

export const forgotPass = (data) => async (dispatch) => {
    const res = await axios.post(`/auth/forgot-password`, data);

    console.log("res forgotPass: ", res);

    if (res.data && res.data.status === 200) {
        dispatch({
            type: FORGOT_PASS,
            payload: res.data,
        });    
    } else {
        dispatch({
            type: FORGOT_PASS_ERROR,
            payload: res.data
        })
    }
    return res.data;
};

// Xóa token login và ra trang login
export const logoutSpecial = () => (dispatch) => {
  dispatch({
    type: AUTH_RESET,
  });
  return jwtService.logoutSpecial(); // removeItem token localeStorage -> chuyển đến trang home-login
};
