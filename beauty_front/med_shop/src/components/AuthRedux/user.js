import { ADD_USER } from "./actions"

const addUser = (user) => {
  return {
    type: ADD_USER,
    payload: user,
  }
}


export default addUser; 