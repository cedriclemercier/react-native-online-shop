import CartItem from '../../models/cart-item';

import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';
import { ADD_ORDER } from '../actions/orders';
import { DELETE_PRODUCT } from '../actions/product';


const initialState = {
  items: {},
  totalAmount: 0,
};

export default (state = initialState, actions) => {
  switch (actions.type) {
    case ADD_TO_CART:
      const addedProduct = actions.product;
      const productTitle = addedProduct.title;
      const productPrice = addedProduct.price;

      let updatedOrNewCartItem;

      if (state.items[addedProduct.id]) {
        // If the item already in the cart
        updatedOrNewCartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          productTitle,
          productPrice,
          state.items[addedProduct.id].sum + productPrice
        );
      } else {
        //   If the item is not, create a new cartitem object to the state
        updatedOrNewCartItem = new CartItem(1, productTitle, productPrice, productPrice);
      }

      return {
        ...state,
        items: {
          ...state.items,
          [addedProduct.id]: updatedOrNewCartItem,
        },
        totalAmount: state.totalAmount + productPrice,
      };

    case REMOVE_FROM_CART:
      const selectedCartItem = state.items[actions.productId];
      const currentQty = selectedCartItem.quantity;

      let updatedCartItems;

      if (currentQty > 1) {
        //  IF current quantity of such item is greater than 1, reduce quantity
        const updatedCartItem = new CartItem(
          selectedCartItem.quantity - 1,
          selectedCartItem.productTitle,
          selectedCartItem.productPrice,
          selectedCartItem.sum - selectedCartItem.productPrice
        );

        updatedCartItems = { ...state.items, [actions.productId]: updatedCartItem };
      } else {
        // If 1, delete the item from cart
        updatedCartItems = { ...state.items };
        delete updatedCartItems[actions.productId];
      }

      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount - selectedCartItem.productPrice,
      };
    case ADD_ORDER:
      return initialState;

    case DELETE_PRODUCT:
      if (!state.items[actions.productId]) {
        return state;
      }
      const updatedItems = { ...state.items };
      const itemTotalAmount = state.items[actions.productId].sum;
      delete updatedItems[actions.productId];
      return {
        ...state,
        items: updatedItems,
        totalAmount: state.totalAmount - itemTotalAmount,
      };

    default:
      return state;
  }
};
