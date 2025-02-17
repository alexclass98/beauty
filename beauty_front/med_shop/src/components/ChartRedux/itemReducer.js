import { ADD_TO_CHART, REMOVE_FROM_CHART, DELETE_FROM_CHART} from "./actions";
const initialState = {
  values: 0,
  products: [],
  productsWithFeatures: [],
  total: 0,
};

const itemReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CHART:
      if (state.products.includes(action.payload.name))
      return {
        values: state.values+1,
        total: state.total + action.payload.price,
        products: state.products.concat(action.payload.name),
        productsWithFeatures: state.productsWithFeatures.map((item,ind,arr)=>{if(item.name===action.payload.name)
         return {
            pk: action.payload.pk,
            name: action.payload.name,
            price: action.payload.price,
            totprice: (arr[ind].sum +1)*(arr[ind].price),
            description: action.payload.description,
            sum: arr[ind].sum +1,
            img: action.payload.img,
            amount: action.payload.amount,
            category: action.payload.category,
           
         }
        else {return item}
        } )
      }
      else 
        return {
          values: state.values +1,
          total: state.total + action.payload.price,
          products: state.products.concat(action.payload.name),
          productsWithFeatures: state.productsWithFeatures.concat({
             pk: action.payload.pk,
             name: action.payload.name,
             price: action.payload.price,
             totprice: action.payload.price,
             description: action.payload.description,
             sum: 1,
             img: action.payload.img,
             amount: action.payload.amount,
             category: action.payload.category,
          })
      }



    case REMOVE_FROM_CHART:
      if (state.products.indexOf(action.payload.name)!==state.products.lastIndexOf(action.payload.name))
            return {
              values: state.values-1,
              total: state.total- action.payload.price,
              products: state.products.map((item,ind,arr)=>{if(item===action.payload.name&&ind===arr.lastIndexOf(action.payload.name)) 
                return '' 
                else{return item}}).filter(item=> item!==''),
              productsWithFeatures: state.productsWithFeatures.map((item,ind,arr)=>{if(item.name===action.payload.name)
                 return {
                  pk: action.payload.pk,
                  name: action.payload.name,
                  price: action.payload.price,
                  totprice: (arr[ind].sum -1)*(arr[ind].price),
                  description: action.payload.description,
                  sum: arr[ind].sum -1,
                  img: action.payload.img,
                  amount: action.payload.amount,
                  category: action.payload.category,
               }
              else {return item}
              } ),
        
      }
      
      else if (state.products.indexOf(action.payload.name)===-1)
        return {
          values: state.values,
          total: state.total,
          products: state.products,
          productsWithFeatures: state.productsWithFeatures
      }
      else{
        return{
          values: state.values-1,
          total: state.total- action.payload.price,
          products: state.products.filter(item=> item!==action.payload.name),
          productsWithFeatures: state.productsWithFeatures.filter(item=> item.name!==action.payload.name)
        }
      }
    case DELETE_FROM_CHART:
    return{
      values: state.values-state.products.filter(item=>item===action.payload.name).length,
      total:state.total - state.products.filter(item=>item===action.payload.name).length*action.payload.price,
      products: state.products.filter(item=> item!==action.payload.name),
      productsWithFeatures: state.productsWithFeatures.filter(item=> item.name!==action.payload.name)
    }
    default:
      return state;
  }
};

export default itemReducer;