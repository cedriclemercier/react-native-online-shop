import Product from '../../models/product';
import { CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT, SET_PRODUCT } from '../actions/product';

const initialState = {
  availableProducts: [],
  userProducts: [],
};

export default (state = initialState, actions) => {
  switch (actions.type) {
    case SET_PRODUCT:
      return {
        availableProducts: actions.products,
        userProducts: actions.userProducts,
      };
    case CREATE_PRODUCT:
      const newProduct = new Product(
        // Id coming from Firebase
        action.productData.id,
        actions.productData.ownerId,
        actions.productData.title,
        actions.productData.description,
        actions.productData.imageUrl,
        actions.productData.price
      );

      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct),
      };

    case UPDATE_PRODUCT:
      const productIndex = state.userProducts.findIndex((el) => el.id === actions.productId);
      const updatedProduct = new Product(
        actions.productId,
        state.userProducts[productIndex].ownerId,
        actions.productData.title,
        actions.productData.imageUrl,
        actions.productData.description,
        state.userProducts[productIndex].price
      );

      console.log(updatedProduct);

      const updatedUserProducts = [...state.userProducts];
      updatedUserProducts[productIndex] = updatedProduct;

      const availableProductIndex = state.availableProducts.findIndex((el) => el.id === actions.productId);
      const updatedAvailableProducts = [...state.availableProducts];
      updatedAvailableProducts[availableProductIndex] = updatedProduct;

      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts,
      };

    case DELETE_PRODUCT:
      const updatedProducts = state.userProducts.filter((el) => actions.productId !== el.id);
      return {
        ...state,
        userProducts: updatedProducts,
        availableProducts: state.availableProducts.filter((el) => actions.productId !== el.id),
      };
    default:
      return state;
  }
};
