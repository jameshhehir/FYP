import axios from "axios";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./auth";

import { GET_DETAILS, DELETE_DETAIL, ADD_DETAIL } from "./types";

// GET DETAILS
export const getDetails = () => (dispatch, getState) => {
  axios
    .get("/api/details/", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_DETAILS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// DELETE DETAIL
export const deleteDetail = id => (dispatch, getState) => {
  axios
    .delete(`/api/details/${id}/`, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage({ deleteDetail: "Detail Deleted" }));
      dispatch({
        type: DELETE_DETAIL,
        payload: id
      });
    })
    .catch(err => console.log(err));
};

// ADD DETAIL
export const addDetail = detail => (dispatch, getState) => {
  axios
    .post("/api/details/", detail, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage({ addDetail: "Detail Added" }));
      dispatch({
        type: ADD_DETAIL,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
