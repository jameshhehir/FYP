import { GET_DETAILS, DELETE_DETAIL, ADD_DETAIL, CLEAR_DETAILS } from "../actions/types.js";

const initialState = {
  details: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_DETAILS:
      return {
        ...state,
        details: action.payload
      };
    case DELETE_DETAIL:
      return {
        ...state,
        details: state.details.filter(detail => detail.id !== action.payload)
      };
    case ADD_DETAIL:
      return {
        ...state,
        details: [...state.details, action.payload]
      };
    case CLEAR_DETAILS:
      return {
        ...state,
        details: []
      };
    default:
      return state;
  }
}
