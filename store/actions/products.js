import Product from "../../models/product";
import Env from "../../constants/Environment";
import firestoreInstance from '../../firestore';

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    try {
      firestoreInstance()
        .collection('products')
        .onSnapshot(
          snapshot => {
            const loadedProducts = [];
            snapshot
              .docChanges({ includeMetadataChanges: false })
              .forEach(element => {
                let product = element.doc.data();
                loadedProducts.push(new Product(
                  element.doc.id,
                  product.ownerId,
                  product.title,
                  product.imageUrl,
                  product.description,
                  product.price,
                  product.category,
                ));
              });
            dispatch({
              type: SET_PRODUCTS,
              products: loadedProducts,
              userProducts: loadedProducts
            });
          },
          err => {
            throw new Error("Something went wrong!");
          },
        );
    } catch (error) {
      // send to custom analytics server
      throw error;
    }
  };
};

export const deleteProduct = productId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `${Env.url}products/${productId}.json?auth=${token}`, // add your own API url
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({
      type: DELETE_PRODUCT,
      pid: productId
    });
  };
};
export const createProduct = (title, description, imageUrl, price, category) => {
  return async (dispatch, getState) => {
    // any async code wanted
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      `${Env.url}products.json?auth=${token}`, // add your own API url
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
          category,
          ownerId: userId
        })
      }
    );
    const resData = await response.json();

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        title,
        description,
        imageUrl,
        price,
        category,
        ownerId: userId
      }
    });
  };
};
export const updateProduct = (id, title, description, imageUrl, price, category) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `${Env.url}products/${id}.json?auth=${token}`, // add your own API url
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, imageUrl, price, category })
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: { title, description, imageUrl, price, category }
    });
  };
};
