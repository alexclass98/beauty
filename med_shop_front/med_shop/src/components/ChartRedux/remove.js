import {  REMOVE_FROM_CHART} from "./actions"

const removeFromChart = (dispatch) => (drug) =>{
    dispatch( {
      type: REMOVE_FROM_CHART,
      payload: drug,
    })
  }
  
  export default removeFromChart; 
  