import Env from "../../constants/Environment";
import Order from "../../models/order";

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";
export const SET_PENDING_ORDERS = "SET_PENDING_ORDERS";
export const SET_DELIVERED_ORDERS = "SET_DELIVERED_ORDERS";

export const fetchOrders = (status) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    let url = `${Env.url}orders.json?orderBy="userId"&equalTo="${userId}"`;
    try {
      if(status) {
        url = `${Env.url}orders.json?orderBy="status"&equalTo="${status === "pending_orders" ? "Ordered" : "Delivered"}"`;
      }
      const response = await fetch(url); // add your own API url
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const resData = await response.json();
      const loadedOrders = [];
      for (const key in resData) {
        loadedOrders.push(
          new Order(
            key,
            resData[key].cartItems,
            resData[key].totalAmount,
            new Date(resData[key].date),
            resData[key].status,
            resData[key].address,
            resData[key].userId
          )
        );
      }
      if(status) {
        if(status === 'delivered_orders') {
          dispatch({ type: SET_DELIVERED_ORDERS, orders: loadedOrders });
        } else {
          dispatch({ type: SET_PENDING_ORDERS, orders: loadedOrders });
        }
      } else {
        dispatch({ type: SET_ORDERS, orders: loadedOrders });
      }
    } catch (err) {
      throw err;
    }
  };
};

export const addOrder = (cartItems, totalAmount, address) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const date = new Date();
    const response = await fetch(
      `${Env.url}orders.json?auth=${token}`, // add your own API url
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          date: date.toISOString(),
          status: "Ordered",
          address: address,
          userId: userId
        })
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const resData = await response.json();

    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: resData.name,
        items: cartItems,
        amount: totalAmount,
        date: date,
        status: "Ordered",
        address: address,
        userId: userId
      }
    });
  };
};
