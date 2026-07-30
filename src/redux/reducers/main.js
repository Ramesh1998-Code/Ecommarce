import {combineReducers} from "redux";
import { cartreducer } from "./reducers";
import { productReducer } from "../reducers/productReducer.js";
const rootred = combineReducers({
    cartreducer,
     product: productReducer 
})

export default rootred