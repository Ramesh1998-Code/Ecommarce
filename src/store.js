import { createStore,applyMiddleware  } from "redux";
import rootred from "./redux/reducers/main";
import { thunk } from "redux-thunk";

import { productReducer } from "./redux/reducers/productReducer";



export const store = createStore(rootred, applyMiddleware(thunk));