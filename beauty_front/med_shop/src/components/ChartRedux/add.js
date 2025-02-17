import { ADD_TO_CHART } from "./actions"

const addToChart = (drug) => {
  return {
    type: ADD_TO_CHART,
    payload: drug,
  }
}


export default addToChart; 
