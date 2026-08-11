const INIT_STATE = {
  carts: [],
  wishlist: [],
  products: []
};
export const cartreducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case "ADD_CART":
      const ItemIndex = state.carts.findIndex(
        (item) => item.id === action.payload.id
      );

      if (ItemIndex >= 0) {
        const updatedCart = state.carts.map((item, index) =>
          index === ItemIndex 
            ? { ...item, qnty: item.qnty + 1 }
            : item
        );

        return {
          ...state, 
          carts: updatedCart
        };
      } else {
        const temp = { ...action.payload, qnty: 1 };

        return {
          ...state,
          carts: [...state.carts, temp]
        };
      }


    case "ADD_WISHLIST":

      const exist = state.wishlist.find((item) => item.id === action.payload.id);

      if (exist) {
        return {
          ...state,
          wishlist: state.wishlist.filter((item) => item.id !== action.payload.id)
        };

      }
      else {
        return {
          ...state,
          wishlist: [...state.wishlist, action.payload]
        }
      }

    case "RMV_CART": const data = state.carts.filter((item) => item.id !== action.payload)
      return {
        ...state,
        carts: data
      }
    case "RMV_ONE":
      const ItemIndex_dec = state.carts.findIndex((item) => item.id === action.payload.id);
      if (state.carts[ItemIndex_dec].qnty >= 1) {
        const dltitem = state.carts[ItemIndex_dec].qnty -= 1;
        return {
          ...state,
          carts: [...state.carts]
        }

      } else if (state.carts[ItemIndex_dec].qnty === 1) {
        const data = state.carts.filter((item) => item.id !== action.payload)
        return {
          ...state,
          carts: data
        }
      }
    default: return state
  }




}