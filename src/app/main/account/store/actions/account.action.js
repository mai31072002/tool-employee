import axios from "axios";
import apiConfig from "app/configs/api.config";
import jwtService from "app/service/jwt";

// ===========  EXPORT ACTION  ============  //

// -- LIST ACCOUNT
export const UPDATE_ACCOUNT = "UPDATE_ACCOUNT";
export const UPDATE_ACCOUNT_ERROR = "UPDATE_ACCOUNT_ERROR";

// -- LIST DETAIL EMPLOYEE
// ===============  API BASE  ================
axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
    apiConfig.accessTokenKey
)}`;

export const UpdateAccount = (id, data) => async (dispatch) => {

    try {
        const res = await axios.put(`/users/${id}`, data);

        if (res.data && res.data.status === 200) {
            dispatch({
                type: UPDATE_ACCOUNT,
                payload: res.data.data,
            });    
        } else {
            dispatch({
                type: UPDATE_ACCOUNT_ERROR,
                payload: res.data.data
            })
        }
        return res.data;

    } catch (error) {

        console.log('UpdateAccount error:', error);

        if (error.response && error.response.status === 401) {

            let tokenNew = jwtService.signInWithToken();

            if (tokenNew) {

                axios.defaults.headers.common.Authorization = `Bearer ${tokenNew}`;

                const res = await axios.put(`/users/${id}`, data);

                dispatch({
                    type: UPDATE_ACCOUNT, 
                    payload: res.data
                });

                return res.data;

            } else {

                dispatch({type: UPDATE_ACCOUNT_ERROR, payload: error});

                throw error;
            }
        } else {

            dispatch({
                type: UPDATE_ACCOUNT_ERROR, 
                payload: error
            });

            throw error;
        }
    }
};