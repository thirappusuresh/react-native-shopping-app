const initialState = {
  availableCategories: {
    groceries: "Groceries",
    dairy_products: "Dairy Products"
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
