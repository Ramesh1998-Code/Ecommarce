const INIT_STATE = {
    products: [],
    loading:false
}


export const productReducer = (state = INIT_STATE, action) => {
    switch(action.type){
        case "SET_PRODUCTS":
            return {
                ...state,
                products: action.payload,
                loading:false
            };
            default: 
            return state;
    }
}