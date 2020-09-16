import Order from '../../models/order';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch(`https://react-native-shop-by-cedric.firebaseio.com/orders/${userId}.json`);

      if (!response.ok) {
        throw new Error('Something went wrong fetching orders!');
      }

      const responseData = await response.json();
      // Transform object response into an array of orders
      const loadedOrders = [];

      for (const key in responseData) {
        console.log(key);
        loadedOrders.push(
          new Order(key, responseData[key].cartItems, responseData[key].totalAmount, new Date(responseData[key].date))
        );
      }

      dispatch({ type: SET_ORDERS, orders: loadedOrders });
    } catch (err) {
      // Can use this to send to analytics
      throw err;
    }
  };
};

export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const date = new Date();
    const response = await fetch(
      `https://react-native-shop-by-cedric.firebaseio.com/orders/${userId}.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          // TODO Date settings should be DONE on the server
          date: date.toISOString(),
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong');
    }
    const responseData = await response.json();

    dispatch({
      type: ADD_ORDER,
      orderData: { id: responseData.name, items: cartItems, amount: totalAmount, date: date },
    });
  };
};
