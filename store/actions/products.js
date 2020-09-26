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
        .orderBy('category', 'asc')
        .onSnapshot(
          snapshot => {
            const loadedProducts = [];
            snapshot.docs.forEach(element => {
              let product = element.data();
              loadedProducts.push(new Product(
                element.id,
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
            console.log("Something went wrong!");
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
    firestoreInstance()
      .collection('products')
      .doc(productId)
      .delete()
      .then(async snapshot => {
        // dispatch({
        //   type: DELETE_PRODUCT,
        //   pid: productId
        // });
      })
      .catch(err => {
        throw new Error("Something went wrong!");
      });
  };
};

export const createProduct = (title, description, imageUrl, price, category) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const request = {
      title,
      description,
      imageUrl,
      price,
      category,
      ownerId: userId
    };
    firestoreInstance()
      .collection('products')
      .add(request)
      .then(async snapshot => {
        if (snapshot.id) {
          request.id = snapshot.id;
          // dispatch({
          //   type: CREATE_PRODUCT,
          //   productData: request
          // });
        }
      })
      .catch(err => {
        throw new Error("Something went wrong!");
      });
  };
};
export const updateProduct = (id, title, description, imageUrl, price, category) => {
  return async (dispatch, getState) => {
    const request = { title, description, imageUrl, price, category };
    firestoreInstance()
      .collection('products')
      .doc(id)
      .set(request, { merge: true })
      .then(async snapshot => {
        // dispatch({
        //   type: UPDATE_PRODUCT,
        //   pid: id,
        //   productData: request
        // });
      })
      .catch(err => {
        throw new Error("Something went wrong!");
      });
  };
};
