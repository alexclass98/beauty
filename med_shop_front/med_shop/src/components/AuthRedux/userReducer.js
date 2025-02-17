import { ADD_USER, LOGOUT} from "./actions";

const initialState = {
    isSubmitted: false,
    token: '',
    username: '',
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case ADD_USER:
        return {
          isSubmitted:  !state.isSubmitted,
          token:  action.payload.token,
          username: action.payload.username
        }

      default:
        return state;
    }
  };
  
  export default userReducer;