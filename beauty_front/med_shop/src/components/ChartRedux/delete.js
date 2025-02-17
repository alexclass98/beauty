import { DELETE_FROM_CHART } from "./actions"

const deleteFromChart = (drug) => {
  return {
    type: DELETE_FROM_CHART,
    payload: drug,
  }
}


export default deleteFromChart; 
  