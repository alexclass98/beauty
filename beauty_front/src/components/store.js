import { useReducer } from "react";
import {
    combineReducers,
    compose,
    legacy_createStore
  } from "redux";

  import userReducer from './AuthRedux/userReducer';
  
  const ReactReduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
  
  function configureStore() {
    return legacy_createStore(
      combineReducers({
        user: userReducer,
        
      }),
      undefined,
      compose(
        ReactReduxDevTools,
      )
    );
  }
  
  export default configureStore;