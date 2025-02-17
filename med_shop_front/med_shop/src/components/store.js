import { useReducer } from "react";
import {
    combineReducers,
    compose,
    legacy_createStore
  } from "redux";
  
  import itemReducer from './ChartRedux/itemReducer';
  import userReducer from './AuthRedux/userReducer';
  
  const ReactReduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
  
  function configureStore() {
    return legacy_createStore(
      combineReducers({
        item: itemReducer,
        user: userReducer,
        
      }),
      undefined,
      compose(
        ReactReduxDevTools,
      )
    );
  }
  
  export default configureStore;