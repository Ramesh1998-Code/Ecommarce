export const fetchProducts = () => async (dispatch) => {
  const res = await fetch("https://dummyjson.com/products");
  const data = await res.json();

  dispatch({
    type: "SET_PRODUCTS",
    payload: data.products
  });
};
