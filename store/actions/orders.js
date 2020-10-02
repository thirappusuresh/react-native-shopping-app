import Env from "../../constants/Environment";
import Order from "../../models/order";
import firestoreInstance from '../../firestore';

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";
export const SET_PENDING_ORDERS = "SET_PENDING_ORDERS";
export const SET_DELIVERED_ORDERS = "SET_DELIVERED_ORDERS";
export const CLEAR_CART = "CLEAR_CART";
let unsubscribeOrdersListener = "";
export const fetchOrders = (status) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      unsubscribeOrdersListener && unsubscribeOrdersListener();
      let query = firestoreInstance().collection('orders');
      if (status) {
        query = query.where("status", '==', status === "pending_orders" ? "Ordered" : "Delivered");
      } else {
        query = query.where("userId", '==', userId);
      }
      query = query.orderBy('date', 'desc');
      unsubscribeOrdersListener = query
        .onSnapshot(
          snapshot => {
            const loadedOrders = [];
            snapshot
              .docs
              .forEach(element => {
                let order = element.data();
                loadedOrders.push(
                  new Order(
                    element.id,
                    order.cartItems,
                    order.totalAmount,
                    new Date(order.date),
                    order.status,
                    order.address,
                    order.userId
                  )
                );
              });
            if (status) {
              if (status === 'delivered_orders') {
                dispatch({ type: SET_DELIVERED_ORDERS, orders: loadedOrders });
              } else {
                dispatch({ type: SET_PENDING_ORDERS, orders: loadedOrders });
              }
            } else {
              dispatch({ type: SET_ORDERS, orders: loadedOrders });
            }
          },
          err => {
            console.log("Something went wrong!");
          },
        );
    } catch (err) {
      throw err;
    }
  };
};

export const addOrder = (cartItems, totalAmount, address, cb) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const date = new Date();
    const request = {
      cartItems,
      totalAmount,
      date: date.toISOString(),
      status: "Ordered",
      address: address,
      userId: userId
    };

    firestoreInstance()
      .collection('orders')
      .add(request)
      .then(async snapshot => {
        if (snapshot.id) {
          dispatch({
            type: CLEAR_CART
          });
          cb && cb();
        }
      })
      .catch(err => {
        throw new Error("Something went wrong!");
      });
  };
};

export const updateOrder = (id, request) => {
  return async (dispatch, getState) => {
    firestoreInstance()
      .collection('orders')
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
